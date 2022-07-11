// SPDX-License-Identifier: None

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Strings.sol";

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

contract Faculty {

    struct Subject {
        string name;
        bool exist;
        address professor;
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
    }

    struct SubjectView {
        uint id;
        string name;
        address professorAddress;
        string professorName;
    }

    struct ProfessorView {
        address id;
        string name;
        uint[] subjects;
    }

    struct StudentView {
        address id;
        string name;
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

    address admin;
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

    function addSubject(string calldata name) external onlyProfessor {
        subjectCount += 1;
        subjects[subjectCount] = Subject({
            name: name,
            exist: true,
            professor : msg.sender
        });

        professors[msg.sender].subjects.push(subjectCount);
    }

    function enrollSubject(uint id) external onlyStudent {
        require(subjects[id].exist == true, "Subject not found.");
        require(students[msg.sender].subjectGrades[id] == 0, "Already enrolled.");

        students[msg.sender].subjectGrades[id] = 5;
    }

    function valueExistsInArray(uint[] memory array, uint value) private pure returns(bool) {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }

        return false;
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
                name: students[studentCountToAddress[i+1]].name
            });
        }

        return studentsArray;
    }

    function getGrade(uint subject) public onlyStudent view returns(uint) {
        require(subjects[subject].exist == true, "Subject not found.");
        require(students[msg.sender].subjectGrades[subject] >= 5, "You are not enrolled in the subject.");
        return students[msg.sender].subjectGrades[subject];
    }
    
    function getMySubjects() public onlyProfessor view returns(uint[] memory subjectsIds) {
        subjectsIds = professors[msg.sender].subjects;
    }

    function getMyAverageGrade() external onlyStudent view returns(string memory averageGrade) {
        uint256 sum;
        uint256 passedSubjCount;

        for (uint i = 1; i <= subjectCount; i++) {
            if (students[msg.sender].subjectGrades[i] > 5) {
                sum += students[msg.sender].subjectGrades[i];
                passedSubjCount += 1;
            }
        }

        require(passedSubjCount > 0, "You don't have any grades.");

        averageGrade = MyMath.division(2, sum, passedSubjCount);
    }

    
}