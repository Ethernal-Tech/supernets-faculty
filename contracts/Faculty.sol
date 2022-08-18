// SPDX-License-Identifier: None

pragma solidity ^0.8.7;

import "./PlanBCertificate.sol";

contract Faculty is PlanBCertificate{

    enum CourseAttendance{ NOT_ENROLLED, ENROLLED, PASSED, FAILED }

    struct Event {
        string title;
        string location;
        string venue;
        uint256 time;
        string description;

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

        uint eventId;
        address professor;
        address[] students;

        bool exist;     
    }

    struct Professor {
        string name;
        uint[] eventCourses;
        bool exist;
    }

    struct Student {
        string name;
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

        address professorAddress;
        string professorName;
        address[] students;
    }

    struct ProfessorView {
        address id;
        string name;
        uint[] courses;
    }

    struct StudentView {
        address id;
        string name;
        uint[] courses;
    }

    struct GradeView {
        uint courseId;
        CourseAttendance courseAttendance;
    }

    modifier onlyAdmin {
        require (msg.sender == admin, "You are not Admin.");
        _;
    }

    address public admin;
    
    uint maxEventId;
    uint maxCourseId;

    mapping(uint => Event) events;
    mapping(uint => Course) courses; 

    constructor() {
        admin = msg.sender;
        maxEventId = 0;
        maxCourseId = 0;   
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

    function addCourse(string calldata title, string calldata description, uint256 startTime, uint256 endTime, string calldata venue, address professor, uint eventId) external onlyAdmin {
        require(events[eventId].exist == true, "Event doesn't exist");
        require(events[eventId].professors[professor].exist == true, "Professor doesn't attend in this event");

        maxCourseId += 1;

        courses[maxCourseId].title = title;
        courses[maxCourseId].description = description;
        courses[maxCourseId].startTime = startTime;
        courses[maxCourseId].endTime = endTime;
        courses[maxCourseId].venue = venue;

        courses[maxCourseId].professor = professor;
        courses[maxCourseId].eventId = eventId;
        courses[maxCourseId].exist = true;
        
        events[eventId].professors[professor].eventCourses.push(maxCourseId);
        events[eventId].courses.push(maxCourseId);
    }

    function addProfessor(address profAddress, string calldata name, uint eventId) external onlyAdmin {
        require(events[eventId].exist == true, "Event doesn't exist");
        require(events[eventId].professors[profAddress].exist == false, "Professor with that address already exists.");

        events[eventId].professors[profAddress].name = name;
        events[eventId].professors[profAddress].exist = true;

        events[eventId].professorsAddresses.push(profAddress);
    }

    function addStudent(address studAddress, string calldata name, uint eventId) external onlyAdmin {
        require(events[eventId].exist == true, "Event doesn't exist");
        require(events[eventId].students[studAddress].exist == false, "Student with that address already exists.");

        events[eventId].students[studAddress].name = name;
        events[eventId].students[studAddress].exist = true;

        events[eventId].studentsAddresses.push(studAddress);
    }

    function enrollCourse(uint courseId, address studAddress) external onlyAdmin {
        require(courses[courseId].exist == true, "Course not found.");

        uint eventId = courses[courseId].eventId;
        require(events[eventId].students[studAddress].exist == true, "Student doesn't attend in this event");
        require(events[eventId].students[studAddress].coursesAttendance[courseId] == CourseAttendance.NOT_ENROLLED, "Already enrolled.");

        events[eventId].students[studAddress].coursesAttendance[courseId] = CourseAttendance.ENROLLED;
        events[eventId].students[studAddress].eventCourses.push(courseId);
        courses[courseId].students.push(studAddress);
    }

    function gradeStudent(uint courseId, address studAddress, bool passed) external {
        require(courses[courseId].exist == true, "Subject not found.");

        uint eventId = courses[courseId].eventId;
        require(events[eventId].students[studAddress].exist == true, "Student not found.");

        require(courses[courseId].professor == msg.sender, "You are not owner of this subject.");
        require(events[eventId].students[studAddress].coursesAttendance[courseId] != CourseAttendance.NOT_ENROLLED, "Student is not enrolled in the subject.");
        require (events[eventId].professors[msg.sender].exist == true, "You are not Professor.");

        events[eventId].students[studAddress].coursesAttendance[courseId] = passed ? CourseAttendance.PASSED : CourseAttendance.FAILED;
    }

    function getAllEvents() public view returns(EventView[] memory) {
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

    function getAllCourses(uint eventId) public view returns(CourseView[] memory) {
        require(events[eventId].exist == true, "Event doesn't exist.");

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
                professorAddress: courses[id].professor,
                professorName: events[eventId].professors[courses[id].professor].name,
                students: courses[id].students
            });
        }

        return coursesArray;
    }

    function getAllProfessors(uint eventId) public view returns(ProfessorView[] memory) {   
        require(events[eventId].exist == true, "Event doesn't exist.");
   
        ProfessorView[] memory professorsArray = new ProfessorView[](events[eventId].professorsAddresses.length);

        for (uint i = 0; i < events[eventId].professorsAddresses.length; i++) {
            address profAddress = events[eventId].professorsAddresses[i];

            professorsArray[i] = ProfessorView({
                id: profAddress,
                name: events[eventId].professors[profAddress].name,
                courses: events[eventId].professors[profAddress].eventCourses
            }); 
        }

        return professorsArray;
    }

    function getAllStudents(uint eventId) public view returns(StudentView[] memory) {      
        require(events[eventId].exist == true, "Event doesn't exist.");

        StudentView[] memory studentsArray = new StudentView[](events[eventId].studentsAddresses.length);

        for (uint i = 0; i < events[eventId].studentsAddresses.length; i++) {
            address studAddress = events[eventId].studentsAddresses[i];

            studentsArray[i] = StudentView({
                id: studAddress,
                name: events[eventId].students[studAddress].name,
                courses: events[eventId].students[studAddress].eventCourses
            });
        }

        return studentsArray;
    }

    function getStudentGrades(address studAddress, uint eventId) public view returns(GradeView[] memory) {
        require(events[eventId].exist == true, "Event doesn't exist.");
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

    function getProfessorSubjects(address professor, uint eventId) public view returns(uint[] memory coursesIds) {
        require(events[eventId].exist == true, "Event doesn't exist.");
        require(events[eventId].professors[professor].exist == true, "Professor not found.");
        coursesIds = events[eventId].professors[professor].eventCourses;
    }
    
    function getStudentCourses(address studentAddress, uint eventId) public view returns(uint[] memory coursesIds) {
        require(events[eventId].exist == true, "Event doesn't exist.");
        require(events[eventId].students[studentAddress].exist == true, "Student not found.");

        coursesIds = events[eventId].students[studentAddress].eventCourses;
    }

    function generateCertificate(address to, string memory uri) public onlyAdmin {
        safeMint(to, uri);
    }

    function getCertificateId(address student) public view returns (uint256) {
        //sta ako vrati 0?
        return getTokenForOwner(student);
    }
}
