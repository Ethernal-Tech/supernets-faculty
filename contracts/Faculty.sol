// SPDX-License-Identifier: None

pragma solidity ^0.8.15;

import "./PlanBCertificate.sol";

contract Faculty {

    enum CourseAttendance{ NOT_ENROLLED, GRADE1, GRADE2, GRADE3, GRADE4, GRADE5, FAILED, ENROLLED }

    struct Event {
        string title;
        string location;
        string venue;
        uint256 time;
        string description;

        address[] adminsAddresses;
        mapping(address => bool) eventAdmins;

        address[] professorsAddresses;
        mapping(address => Professor) professors;

        address[] studentsAddresses;
        mapping(address => Student) students;

        uint[] courses;

        bool exist;
    }

    struct Course {
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        string venue;
        uint points;

        uint eventId;
        address professor;
        address[] students;

        bool exist;
    }

    struct Professor {
        string firstName;
        string lastName;
        string country;
        string expertise;

        uint[] eventCourses;
        bool exist;
    }

    struct Student {
        string firstName;
        string lastName;
        string country;

        mapping(uint => CourseAttendance) coursesAttendance;
        uint[] eventCourses;   
        bool exist;
    }

    struct EventView {
        uint eventId;
        string title;
        string location;
        string venue;
        uint256 time;
        string description;
    }

    struct CourseView {
        uint id;
        string title;
        string description;      
        uint256 startTime;
        uint256 endTime;
        string venue;
        uint points;

        address professorAddress;
        string professorName;
        address[] students;
    }

    struct ProfessorView {
        address id;
        string firstName;
        string lastName;
        string country;
        string expertise;
        uint[] courses;
    }

    struct StudentView {
        address id;
        string firstName;
        string lastName;
        string country;
        uint[] courses;
    }

    struct GradeView {
        uint courseId;
        CourseAttendance courseAttendance;
    }

    struct StudentGrade {
        address studentAddress;
        CourseAttendance courseAttendance;
    }

    modifier onlyAdmin {
        require (msg.sender == admin);
        _;
    }

    modifier eventAdmin(uint eventId) {
        require (isAdmin(eventId, msg.sender) == true);
        _;
    }

    modifier eventExists(uint eventId) {
        require(events[eventId].exist == true);
        _;
    }

    modifier canAddAddress(uint eventId, address addr) {
        require(events[eventId].eventAdmins[addr] == false);
        require(events[eventId].professors[addr].exist == false);
        require(events[eventId].students[addr].exist == false);
        _;
    }

    address public admin;
    
    uint maxEventId;
    uint maxCourseId;

    mapping(uint => Event) events;
    mapping(uint => Course) courses;
    PlanBCertificate planBCertificate;

    constructor(address certificateAddress) {
        admin = msg.sender;
        maxEventId = 0;
        maxCourseId = 0;
        
        planBCertificate = PlanBCertificate(certificateAddress);   
    }

    function addEvent(string calldata title, string calldata location, string calldata venue, uint256 time, string calldata description) external onlyAdmin {
        maxEventId += 1;

        events[maxEventId].title = title;
        events[maxEventId].location = location;
        events[maxEventId].venue = venue;
        events[maxEventId].time = time;
        events[maxEventId].description = description;

        events[maxEventId].exist = true;
    }

    function addCourse(string calldata title, string calldata description, uint256 startTime, uint256 endTime, string calldata venue, address professor, uint points, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(events[eventId].professors[professor].exist == true);

        maxCourseId += 1;

        courses[maxCourseId].title = title;
        courses[maxCourseId].description = description;
        courses[maxCourseId].startTime = startTime;
        courses[maxCourseId].endTime = endTime;
        courses[maxCourseId].venue = venue;
        courses[maxCourseId].points = points;

        courses[maxCourseId].professor = professor;
        courses[maxCourseId].eventId = eventId;
        courses[maxCourseId].exist = true;
        
        events[eventId].professors[professor].eventCourses.push(maxCourseId);
        events[eventId].courses.push(maxCourseId);
    }

    function addEventAdmin(uint eventId, address adminAddress) external onlyAdmin eventExists(eventId) canAddAddress(eventId, adminAddress) {
        events[eventId].eventAdmins[adminAddress] = true;
        events[eventId].adminsAddresses.push(adminAddress);
    }

    function addProfessor(address profAddress, string calldata firstName, string calldata lastName, string calldata country, string calldata expertise, uint eventId) external eventAdmin(eventId) eventExists(eventId) canAddAddress(eventId, profAddress) {
        populateProfessor(profAddress, firstName, lastName, country, expertise, eventId);
        events[eventId].professorsAddresses.push(profAddress);
    }

    function editProfessor(address profAddress, string calldata firstName, string calldata lastName, string calldata country, string calldata expertise, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(events[eventId].professors[profAddress].exist == true);
        populateProfessor(profAddress, firstName, lastName, country, expertise, eventId);
    }

    function addStudent(address studAddress, string calldata firstName, string calldata lastName, string calldata country, uint eventId) external eventAdmin(eventId) eventExists(eventId) canAddAddress(eventId, studAddress) {
        populateStudent(studAddress, firstName, lastName, country, eventId);
        events[eventId].studentsAddresses.push(studAddress);
    }

    function editStudent(address studAddress, string calldata firstName, string calldata lastName, string calldata country, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(events[eventId].students[studAddress].exist == true);
        populateStudent(studAddress, firstName, lastName, country, eventId);
    }

    function enrollCourseMultiple(uint courseId, address[] calldata studAddresses) external {
        uint eventId = courses[courseId].eventId;
        require(events[eventId].exist == true);
        require(isAdmin(eventId, msg.sender));

        for (uint i = 0; i < studAddresses.length; i++) {
            address studAddress = studAddresses[i];
            require(events[eventId].students[studAddress].exist == true);
            require(events[eventId].students[studAddress].coursesAttendance[courseId] == CourseAttendance.NOT_ENROLLED);

            events[eventId].students[studAddress].coursesAttendance[courseId] = CourseAttendance.ENROLLED;
            events[eventId].students[studAddress].eventCourses.push(courseId);
            courses[courseId].students.push(studAddress);
        }
    }

    function gradeStudents(uint courseId, StudentGrade[] studentGrades) external {
        require(courses[courseId].exist == true);

        uint eventId = courses[courseId].eventId;
        require(isAdmin(eventId, msg.sender));

        for (uint i = 0; i < studentGrades.length; i++) {
            StudentGrade studentGrade = studentGrades[i];

            require(events[eventId].students[studentGrade.studentAddress].exist == true);
            CourseAttendance curentGrade = events[eventId].students[studentGrade.studentAddress].coursesAttendance[courseId];
            require(curentGrade == CourseAttendance.ENROLLED || curentGrade == CourseAttendance.FAILED);
            require(studentGrade.courseAttendance >= CourseAttendance.GRADE1 && 
                studentGrade.courseAttendance <= CourseAttendance.FAILED);

            events[eventId].students[studentGrade.studentAddress].coursesAttendance[courseId] = studentGrade.courseAttendance;
        }
    }

    // Get functions

    function getAllEvents() external view returns(EventView[] memory) {
        EventView[] memory eventsArray = new EventView[](maxEventId);

        for (uint i = 1; i <= maxEventId; i++) {
            eventsArray[i-1] = EventView({
                eventId: i,
                title: events[i].title,
                location: events[i].location,
                venue: events[i].venue,
                time: events[i].time,
                description: events[i].description
            });
        }

        return eventsArray;
    }

    function getAllCourses(uint eventId) external view eventExists(eventId) returns(CourseView[] memory) {
        CourseView[] memory coursesArray = new CourseView[](events[eventId].courses.length);

        for (uint i = 0; i < events[eventId].courses.length; i++) {
            uint id = events[eventId].courses[i];

            coursesArray[i] = CourseView({
                id: id,
                title: courses[id].title,
                description: courses[id].description,
                startTime: courses[id].startTime,
                endTime: courses[id].endTime,
                venue: courses[id].venue,
                points: courses[id].points,
                professorAddress: courses[id].professor,
                professorName: string(abi.encodePacked(events[eventId].professors[courses[id].professor].firstName, " ", events[eventId].professors[courses[id].professor].lastName)),
                students: courses[id].students
            });
        }

        return coursesArray;
    }

    function getAllAdmins(uint eventId) external view eventExists(eventId) returns(address[] memory) {
        return events[eventId].adminsAddresses;
    }

    function getAllProfessors(uint eventId) external view eventExists(eventId) returns(ProfessorView[] memory) {   
        ProfessorView[] memory professorsArray = new ProfessorView[](events[eventId].professorsAddresses.length);

        for (uint i = 0; i < events[eventId].professorsAddresses.length; i++) {
            address profAddress = events[eventId].professorsAddresses[i];

            professorsArray[i] = ProfessorView({
                id: profAddress,
                firstName: events[eventId].professors[profAddress].firstName,
                lastName: events[eventId].professors[profAddress].lastName,
                country: events[eventId].professors[profAddress].country,
                expertise: events[eventId].professors[profAddress].expertise,
                courses: events[eventId].professors[profAddress].eventCourses
            }); 
        }

        return professorsArray;
    }

    function getAllStudents(uint eventId) external view eventExists(eventId) returns(StudentView[] memory) {
        StudentView[] memory studentsArray = new StudentView[](events[eventId].studentsAddresses.length);

        for (uint i = 0; i < events[eventId].studentsAddresses.length; i++) {
            address studAddress = events[eventId].studentsAddresses[i];

            studentsArray[i] = StudentView({
                id: studAddress,
                firstName: events[eventId].students[studAddress].firstName,
                lastName: events[eventId].students[studAddress].lastName,
                country: events[eventId].students[studAddress].country,
                courses: events[eventId].students[studAddress].eventCourses
            });
        }

        return studentsArray;
    }

    function getStudentGrades(address studAddress, uint eventId) external view eventExists(eventId) returns(GradeView[] memory) {
        require(events[eventId].students[studAddress].exist == true, "Student not found.");

        GradeView[] memory grades = new GradeView[](events[eventId].students[studAddress].eventCourses.length);
        
        for (uint i = 0; i < events[eventId].students[studAddress].eventCourses.length; i++) {
            uint courseId = events[eventId].students[studAddress].eventCourses[i];
            grades[i] = GradeView({
                courseId: courseId,
                courseAttendance: events[eventId].students[studAddress].coursesAttendance[courseId]
            });       
        }

        return grades;
    }

    function getProfessorCourses(address professor, uint eventId) external view eventExists(eventId) returns(uint[] memory coursesIds) {
        require(events[eventId].professors[professor].exist == true, "Professor not found.");
        coursesIds = events[eventId].professors[professor].eventCourses;
    }
    
    function getStudentCourses(address studentAddress, uint eventId) external view eventExists(eventId) returns(uint[] memory coursesIds) {
        require(events[eventId].students[studentAddress].exist == true, "Student not found.");

        coursesIds = events[eventId].students[studentAddress].eventCourses;
    }

    function generateCertificate(address to, string memory uri) external onlyAdmin {
        planBCertificate.safeMint(to, uri);
    }

    function getCertificateId(address student) external view returns (uint256) {
        //sta ako vrati 0?
        return planBCertificate.getTokenForOwner(student);
    }

    // Private functions

    function isAdmin(uint eventId, address addr) private view returns(bool) {
        return (events[eventId].eventAdmins[addr] || addr == admin);
    }

    function populateProfessor(address profAddress, string calldata firstName, string calldata lastName, string calldata country, string calldata expertise, uint eventId) private {
        events[eventId].professors[profAddress].firstName = firstName;
        events[eventId].professors[profAddress].lastName = lastName;
        events[eventId].professors[profAddress].country = country;
        events[eventId].professors[profAddress].expertise = expertise;
        events[eventId].professors[profAddress].exist = true;
    }

    function populateStudent(address studAddress, string calldata firstName, string calldata lastName, string calldata country, uint eventId) private {
        events[eventId].students[studAddress].firstName = firstName;
        events[eventId].students[studAddress].lastName = lastName;
        events[eventId].students[studAddress].country = country;
        events[eventId].students[studAddress].exist = true;
    }

    // function getCourseAttendance(uint grade) private pure returns(CourseAttendance) {
    //     if (grade == 1) {
    //         return CourseAttendance.GRADE1;
    //     } else if (grade == 2) {
    //         return CourseAttendance.GRADE2;
    //     } else if (grade == 3) {
    //         return CourseAttendance.GRADE3;
    //     } else if (grade == 4) {
    //         return CourseAttendance.GRADE4;
    //     } else if (grade == 5) {
    //         return CourseAttendance.GRADE5;
    //     } else {
    //         return CourseAttendance.FAILED;
    //     }
    // }
}
