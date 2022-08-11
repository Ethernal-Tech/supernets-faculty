// SPDX-License-Identifier: None

pragma solidity ^0.8.7;

import "./PlanBCertificate.sol";

library MyMath {
    using Strings for uint256;

    function division(uint256 decimalPlaces, uint256 numerator, uint256 denominator) public pure returns(string memory result) {
        require(denominator != 0, "Denominator must not be 0!");
        
        uint256 factor = 10**decimalPlaces;
        uint256 quotient  = numerator / denominator;
        bool rounding = 2 * ((numerator * factor) % denominator) >= denominator;
        uint256 remainder = (numerator * factor / denominator) % factor;
        if (rounding) {
            remainder += 1;
        }
        result = string(abi.encodePacked(quotient.toString(), '.', numToFixedLengthStr(decimalPlaces, remainder)));
    }

    function numToFixedLengthStr(uint256 decimalPlaces, uint256 num) pure internal returns(string memory result) {
        bytes memory byteString;
        for (uint256 i = 0; i < decimalPlaces; i++) {
            uint256 remainder = num % 10;
            byteString = abi.encodePacked(remainder.toString(), byteString);
            num = num/10;
        }
        result = string(byteString);
    }
}

contract Faculty is PlanBCertificate{

    struct Subject {
        string name;
        bool exist;
        address professor;
        address[] students;
    }

    struct Professor {
        string name;
        bool exist;
        uint[] subjects;
    }

    struct Student {
        string name;
        bool exist;
        mapping(uint => uint) subjectGrades;
        uint subjectCount;
    }

    struct ProfessorView {
        address id;
        string name;
        uint[] subjects;
    }

    struct StudentView {
        address id;
        string name;
        uint[] subjects;
    }

    struct SubjectView {
        uint id;
        string name;
        address professorAddress;
        string professorName;
        address[] students;
    }

    struct GradeView {
        uint id;
        uint grade;
    }

    modifier onlyAdmin {
        require (msg.sender == admin, "You are not Admin.");
        _;
    }

    modifier onlyProfessor {
        require (professors[msg.sender].exist == true, "You are not Professor.");
        _;
    }

    modifier onlyStudent {
        require (students[msg.sender].exist == true, "You are not Student.");
        _;
    }

    address public admin;
    uint subjectCount;
    uint professorCount;
    uint studentCount;

    mapping(uint => address) professorCountToAddress;
    mapping(uint => address) studentCountToAddress;

    mapping(address => Professor) public professors; 
    mapping(address => Student) public students; 
    mapping(uint => Subject) public subjects;

    constructor() {
        admin = msg.sender;
        subjectCount = 0;
        professorCount = 0;
        studentCount = 0;
    }

    function addProfessor(address id, string calldata name) external onlyAdmin {
        require(professors[id].exist == false, "Professor with that address already exists.");
        professorCount += 1;
        professorCountToAddress[professorCount] = id;

        professors[id].name = name;
        professors[id].exist = true;
    }

    function addStudent(address id, string calldata name) external onlyAdmin {
        require(students[id].exist == false, "Student with that address already exists.");
        studentCount += 1;
        studentCountToAddress[studentCount] = id;

        students[id].name = name;
        students[id].exist = true;
    }

    function addSubject(string calldata name, address professor) external onlyAdmin {
        subjectCount += 1;

        subjects[subjectCount].name = name;
        subjects[subjectCount].exist = true;
        subjects[subjectCount].professor = professor;

        professors[professor].subjects.push(subjectCount);
    }

    function gradeStudent(uint subject, address student, uint grade) external onlyProfessor {
        require(subjects[subject].exist == true, "Subject not found.");
        require(students[student].exist == true, "Student not found.");

        require(valueExistsInArray(professors[msg.sender].subjects, subject) == true, "Professor is not owner of this subject.");
        require(students[student].subjectGrades[subject] >= 5, "Student is not enrolled in the subject.");
        require(students[student].subjectGrades[subject] == 5, "Already graded");
        
        require(grade >= 5 && grade <= 10, "Grade not in range 5-10");

        students[student].subjectGrades[subject] = grade;
    }

    function enrollSubject(uint id, address student) external onlyAdmin {
        require(subjects[id].exist == true, "Subject not found.");
        require(students[student].subjectGrades[id] == 0, "Already enrolled.");

        students[student].subjectGrades[id] = 5;
        students[student].subjectCount += 1;
        subjects[id].students.push(student);
    }

    function getAllProfessors() public view returns(ProfessorView[] memory) {      
        ProfessorView[] memory professorsArray = new ProfessorView[](professorCount);

        for (uint i = 0; i < professorCount; i++) {
            professorsArray[i] = ProfessorView({
                id: professorCountToAddress[i+1],
                name: professors[professorCountToAddress[i+1]].name,
                subjects: professors[professorCountToAddress[i+1]].subjects
            }); 
        }

        return professorsArray;
    }

    function getAllStudents() public view returns(StudentView[] memory) {      
        StudentView[] memory studentsArray = new StudentView[](studentCount);

        for (uint i = 0; i < studentCount; i++) {
            studentsArray[i] = StudentView({
                id: studentCountToAddress[i+1],
                name: students[studentCountToAddress[i+1]].name,
                subjects: getStudentSubjects(studentCountToAddress[i+1])
            });
        }

        return studentsArray;
    }

    function getAllSubjects() public view returns(SubjectView[] memory) {
        SubjectView[] memory subjectsArray = new SubjectView[](subjectCount);

        for (uint i = 1; i <= subjectCount; i++) {
            subjectsArray[i-1] = SubjectView({
                id: i,
                name: subjects[i].name,
                professorAddress: subjects[i].professor,
                professorName: professors[subjects[i].professor].name,
                students: subjects[i].students
            });
        }

        return subjectsArray;
    }

    function getStudentGrades(address student) public view returns(GradeView[] memory) {
        GradeView[] memory grades = new GradeView[](students[student].subjectCount);
        uint count = 0;
        
        for (uint i = 1; i <= subjectCount; i++) {
            if (students[student].subjectGrades[i] > 0) {
                grades[count] = GradeView({
                    id: i,
                    grade: students[student].subjectGrades[i]
                });
                count += 1;
            }
        }

        return grades;
    }

    function getProfessorSubjects(address professor) public view returns(uint[] memory subjectsIds) {
        require(professors[professor].exist == true, "Professor not found.");
        subjectsIds = professors[professor].subjects;
    }
    
    function getStudentSubjects(address student) public view returns(uint[] memory) {
        require(students[student].exist == true, "Student not found.");

        uint[] memory subjectIds = new uint[](students[student].subjectCount);
        uint count = 0;

        for (uint i = 1; i <= subjectCount; i++) {
            if (students[student].subjectGrades[i] > 0) {
                subjectIds[count] = i;
                count += 1;
            }
        }

        return subjectIds;
    }

    function getNumberOfPassedSubjects(address student) external view returns(uint256) {
        uint256 passedSubjCount;

        for (uint i = 1; i <= subjectCount; i++) {
            if (students[student].subjectGrades[i] > 5) {
                passedSubjCount += 1;
            }
        }

        require(passedSubjCount > 0, "You did not pass any subject.");

        return passedSubjCount;
    }

    function getAverageGrade(address student) external view returns(string memory averageGrade) {
        uint256 sum;
        uint256 passedSubjCount;

        for (uint i = 1; i <= subjectCount; i++) {
            if (students[student].subjectGrades[i] > 5) {
                sum += students[student].subjectGrades[i];
                passedSubjCount += 1;
            }
        }

        require(passedSubjCount > 0, "You did not pass any subject.");

        averageGrade = MyMath.division(2, sum, passedSubjCount);
    }

    function valueExistsInArray(uint[] memory array, uint value) private pure returns(bool) {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }

        return false;
    }

    function generateCertificate(address student, string memory uri) public onlyAdmin {
        for (uint i = 1; i <= subjectCount; i++) {
            bool isEnrolled = students[student].subjectGrades[i] != 0;
            bool hasGrade = students[student].subjectGrades[i] > 5;
            require(!isEnrolled || (isEnrolled && hasGrade), "Student did not pass all subjects!");
        }

        safeMint(student, uri);
    }
}
