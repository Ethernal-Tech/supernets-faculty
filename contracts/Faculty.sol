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

        uint adminsCount;
        address[] adminsAddresses;
        mapping(address => bool) eventAdmins;

        uint professorsCount;
        address[] professorsAddresses;
        mapping(address => Professor) professors;

        uint studentsCount;
        address[] studentsAddresses;
        mapping(address => Student) students;

        uint coursesCount;
        uint[] coursesIds;
        mapping(uint => Course) courses;

        bool exist;
    }

    struct Course {
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        string venue;
        uint points;

        address professor;

        uint studentsCount;
        mapping(address => bool) enrolledStudents;
        address[] students;

        bool exist;
    }

    struct Professor {
        string firstName;
        string lastName;
        string country;
        string expertise;

        uint coursesCount;
        uint[] eventCourses;
        bool exist;
    }

    struct Student {
        string firstName;
        string lastName;
        string country;

        uint coursesCount;
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

    uint eventCount;

    mapping(uint => Event) events;
    PlanBCertificate planBCertificate;

    constructor(address certificateAddress) {
        admin = msg.sender;
        maxEventId = 0;
        maxCourseId = 0;
        
        planBCertificate = PlanBCertificate(certificateAddress);   
    }

    function addEvent(string calldata title, string calldata location, string calldata venue, uint256 time, string calldata description) external onlyAdmin {
        maxEventId ++;

        events[maxEventId].title = title;
        events[maxEventId].location = location;
        events[maxEventId].venue = venue;
        events[maxEventId].time = time;
        events[maxEventId].description = description;

        events[maxEventId].exist = true;
        eventCount ++;
    }

    function deleteEvent(uint eventId) external eventExists(eventId) onlyAdmin {
        events[eventId].exist = false;
        eventCount--;
    }

    function addCourse(string calldata title, string calldata description, uint256 startTime, uint256 endTime, string calldata venue, address professor, uint points, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(events[eventId].professors[professor].exist == true);

        maxCourseId ++;

        events[eventId].courses[maxCourseId].title = title;
        events[eventId].courses[maxCourseId].description = description;
        events[eventId].courses[maxCourseId].startTime = startTime;
        events[eventId].courses[maxCourseId].endTime = endTime;
        events[eventId].courses[maxCourseId].venue = venue;
        events[eventId].courses[maxCourseId].points = points;

        events[eventId].courses[maxCourseId].professor = professor;
        events[eventId].courses[maxCourseId].exist = true;
        
        events[eventId].coursesCount++;
        events[eventId].professors[professor].coursesCount++;
        events[eventId].professors[professor].eventCourses.push(maxCourseId);
        events[eventId].coursesIds.push(maxCourseId);

    }

    function deleteCourse(uint eventId, uint courseId) external eventExists(eventId) eventAdmin(eventId) {
        require(events[eventId].courses[courseId].exist == true);
        events[eventId].courses[courseId].exist = false;

        events[eventId].coursesCount--;
        events[eventId].professors[events[eventId].courses[courseId].professor].coursesCount--;
        for (uint i = 0; i < events[eventId].courses[courseId].students.length; i++) {
            address studentAddr = events[eventId].courses[courseId].students[i];
            events[eventId].students[studentAddr].coursesAttendance[courseId] = CourseAttendance.NOT_ENROLLED;
            events[eventId].students[studentAddr].coursesCount--;
        }
    }

    function addEventAdmin(uint eventId, address adminAddress) external onlyAdmin eventExists(eventId) canAddAddress(eventId, adminAddress) {
        events[eventId].eventAdmins[adminAddress] = true;
        events[eventId].adminsAddresses.push(adminAddress);
        events[eventId].adminsCount ++;

        planBCertificate.addEventAdmin(eventId, adminAddress);
    }

    function deleteEventAdmin(uint eventId, address adminAddress) external onlyAdmin eventExists(eventId) {
        require(events[eventId].eventAdmins[adminAddress]);
        events[eventId].eventAdmins[adminAddress] = false;
        events[eventId].adminsCount --;

        planBCertificate.deleteEventAdmin(eventId, adminAddress);
    }

    function addProfessor(address profAddress, string calldata firstName, string calldata lastName, string calldata country, string calldata expertise, uint eventId) external eventAdmin(eventId) eventExists(eventId) canAddAddress(eventId, profAddress) {
        populateProfessor(profAddress, firstName, lastName, country, expertise, eventId);
        events[eventId].professorsAddresses.push(profAddress);

        events[eventId].professorsCount ++;
    }

    function editProfessor(address profAddress, string calldata firstName, string calldata lastName, string calldata country, string calldata expertise, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(events[eventId].professors[profAddress].exist == true);
        populateProfessor(profAddress, firstName, lastName, country, expertise, eventId);
    }

    function addStudent(address studAddress, string calldata firstName, string calldata lastName, string calldata country, uint eventId) external eventAdmin(eventId) eventExists(eventId) canAddAddress(eventId, studAddress) {
        populateStudent(studAddress, firstName, lastName, country, eventId);
        events[eventId].studentsAddresses.push(studAddress);

        events[eventId].studentsCount ++;
    }

    function editStudent(address studAddress, string calldata firstName, string calldata lastName, string calldata country, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(events[eventId].students[studAddress].exist == true);
        populateStudent(studAddress, firstName, lastName, country, eventId);
    }

    function deleteUser(address userAddress, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        if (events[eventId].professors[userAddress].exist) {
            events[eventId].professors[userAddress].exist = false;
            events[eventId].professorsCount --;
        } else if (events[eventId].students[userAddress].exist) {
            events[eventId].students[userAddress].exist = false;
            events[eventId].studentsCount --;

            for (uint i = 0; i < events[eventId].students[userAddress].eventCourses.length; i++) {
                uint courseId = events[eventId].students[userAddress].eventCourses[i];
                events[eventId].courses[courseId].enrolledStudents[userAddress] = false;
                events[eventId].courses[courseId].studentsCount--;
            }

        } else {
            revert();
        }
    }

    function enrollCourseMultiple(uint courseId, address[] calldata studAddresses, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
 
        for (uint i = 0; i < studAddresses.length; i++) {
            address studAddress = studAddresses[i];
            require(events[eventId].students[studAddress].exist == true);
            require(events[eventId].courses[courseId].exist == true);
            require(events[eventId].students[studAddress].coursesAttendance[courseId] == CourseAttendance.NOT_ENROLLED);

            events[eventId].students[studAddress].coursesAttendance[courseId] = CourseAttendance.ENROLLED;
            events[eventId].students[studAddress].eventCourses.push(courseId);
            events[eventId].students[studAddress].coursesCount++;

            events[eventId].courses[courseId].students.push(studAddress);
            events[eventId].courses[courseId].enrolledStudents[studAddress] = true;
            events[eventId].courses[courseId].studentsCount++;
        }
    }

    function gradeStudents(uint courseId, StudentGrade[] memory studentGrades, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(events[eventId].courses[courseId].exist == true);

        for (uint i = 0; i < studentGrades.length; i++) {
            StudentGrade memory studentGrade = studentGrades[i];

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
        EventView[] memory eventsArray = new EventView[](eventCount);
        uint count = 0;

        for (uint i = 1; i <= maxEventId; i++) {
            if (events[i].exist == true){
                eventsArray[count++] = EventView({
                    eventId: i,
                    title: events[i].title,
                    location: events[i].location,
                    venue: events[i].venue,
                    time: events[i].time,
                    description: events[i].description
                });
            }
        }

        return eventsArray;
    }

    function getAllCourses(uint eventId) external view eventExists(eventId) returns(CourseView[] memory) {
        CourseView[] memory coursesArray = new CourseView[](events[eventId].coursesCount);
        uint count = 0;

        for (uint i = 0; i < events[eventId].coursesIds.length; i++) {
            uint id = events[eventId].coursesIds[i];
            if (events[eventId].courses[id].exist == true) {                
                coursesArray[count] = CourseView({
                    id: id,
                    title: events[eventId].courses[id].title,
                    description: events[eventId].courses[id].description,
                    startTime: events[eventId].courses[id].startTime,
                    endTime: events[eventId].courses[id].endTime,
                    venue: events[eventId].courses[id].venue,
                    points: events[eventId].courses[id].points,
                    professorAddress: address(0),
                    professorName: "",
                    students: new address[](events[eventId].courses[id].studentsCount)
                });

                address profAddress = events[eventId].courses[id].professor;
                if (events[eventId].professors[profAddress].exist) {
                    coursesArray[count].professorAddress = profAddress;
                    coursesArray[count].professorName = string(abi.encodePacked(
                        events[eventId].professors[events[eventId].courses[id].professor].firstName, " ", 
                        events[eventId].professors[events[eventId].courses[id].professor].lastName));
                }

                uint studentsCounter;
                for (uint j = 0; j < events[eventId].courses[id].students.length; j++) {
                    address studAddr = events[eventId].courses[id].students[j];
                    if (events[eventId].courses[id].enrolledStudents[studAddr]) {
                        coursesArray[count].students[studentsCounter++] = studAddr;
                    }
                }

                count++;
            }
        }

        return coursesArray;
    }

    function getAllAdmins(uint eventId) external view eventExists(eventId) returns(address[] memory) {
        address[] memory adminsAddresses = new address[](events[eventId].adminsCount);
        uint count = 0;

        for (uint i = 0; i < events[eventId].adminsAddresses.length; i++) {
            address adminAddr = events[eventId].adminsAddresses[i];
            if (events[eventId].eventAdmins[adminAddr] == true) {
                adminsAddresses[count++] = adminAddr;
            }
        }

        return events[eventId].adminsAddresses;
    }

    function getAllProfessors(uint eventId) external view eventExists(eventId) returns(ProfessorView[] memory) {   
        ProfessorView[] memory professorsArray = new ProfessorView[](events[eventId].professorsCount);
        uint profCounter;

        for (uint i = 0; i < events[eventId].professorsAddresses.length; i++) {
            address profAddress = events[eventId].professorsAddresses[i];

            if (events[eventId].professors[profAddress].exist) {
                professorsArray[profCounter] = ProfessorView({
                    id: profAddress,
                    firstName: events[eventId].professors[profAddress].firstName,
                    lastName: events[eventId].professors[profAddress].lastName,
                    country: events[eventId].professors[profAddress].country,
                    expertise: events[eventId].professors[profAddress].expertise,
                    courses: new uint[](events[eventId].professors[profAddress].coursesCount)
                }); 

                uint courseCount = 0;
                for (uint j = 0; j < events[eventId].professors[profAddress].eventCourses.length; j++) {
                    uint courseId = events[eventId].professors[profAddress].eventCourses[j];
                    if (events[eventId].courses[courseId].exist) {
                        professorsArray[profCounter].courses[courseCount++] = courseId;
                    }
                }

                profCounter++;
            }
        }

        return professorsArray;
    }

    function getAllStudents(uint eventId) external view eventExists(eventId) returns(StudentView[] memory) {
        StudentView[] memory studentsArray = new StudentView[](events[eventId].studentsCount);
        uint studentCounter;

        for (uint i = 0; i < events[eventId].studentsAddresses.length; i++) {
            address studAddress = events[eventId].studentsAddresses[i];

            if (events[eventId].students[studAddress].exist) {
                studentsArray[studentCounter] = StudentView({
                    id: studAddress,
                    firstName: events[eventId].students[studAddress].firstName,
                    lastName: events[eventId].students[studAddress].lastName,
                    country: events[eventId].students[studAddress].country,
                    courses: events[eventId].students[studAddress].eventCourses
                });

                studentsArray[studentCounter].courses = new uint[](events[eventId].students[studAddress].coursesCount);
                uint courseCount = 0;
                for (uint j = 0; j < events[eventId].students[studAddress].eventCourses.length; j++) {
                    uint courseId = events[eventId].students[studAddress].eventCourses[j];
                    if (events[eventId].courses[courseId].exist) {
                        studentsArray[studentCounter].courses[courseCount++] = courseId;
                    }
                }

                studentCounter++;
            }
        }

        return studentsArray;
    }

    function getStudentGrades(address studAddress, uint eventId) external view eventExists(eventId) returns(GradeView[] memory) {
        require(events[eventId].students[studAddress].exist == true, "Student not found.");

        GradeView[] memory grades = new GradeView[](events[eventId].students[studAddress].coursesCount);
        uint count = 0;
        
        for (uint i = 0; i < events[eventId].students[studAddress].eventCourses.length; i++) {
            uint courseId = events[eventId].students[studAddress].eventCourses[i];
            if (events[eventId].courses[courseId].exist) {
                grades[count++] = GradeView({
                    courseId: courseId,
                    courseAttendance: events[eventId].students[studAddress].coursesAttendance[courseId]
                }); 
            }     
        }

        return grades;
    }

    function getProfessorCourses(address professor, uint eventId) external view eventExists(eventId) returns(uint[] memory) {
        require(events[eventId].professors[professor].exist == true, "Professor not found.");

        uint[] memory coursesIds = new uint[](events[eventId].professors[professor].coursesCount);
        uint count = 0;

        for (uint i = 0; i < events[eventId].professors[professor].eventCourses.length; i++) {
            uint courseId = events[eventId].professors[professor].eventCourses[i];
            if (events[eventId].courses[courseId].exist) {
                coursesIds[count++] = courseId;
            }
        }

        return coursesIds;
    }
    
    function getStudentCourses(address studentAddress, uint eventId) external view eventExists(eventId) returns(uint[] memory) {
        require(events[eventId].students[studentAddress].exist == true, "Student not found.");

        uint[] memory coursesIds = new uint[](events[eventId].students[studentAddress].coursesCount);
        uint count = 0;

        for (uint i = 0; i < events[eventId].students[studentAddress].eventCourses.length; i++) {
            uint courseId = events[eventId].students[studentAddress].eventCourses[i];
            if (events[eventId].courses[courseId].exist) {
                coursesIds[count++] = courseId;
            }
        }

        return coursesIds;
    }

    function generateCertificate(address studentAddress, string memory uri, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(events[eventId].students[studentAddress].exist == true, "Student not found.");
        planBCertificate.safeMint(studentAddress, uri, eventId);
    }

    function getCertificateId(address student, uint eventId) external view returns (uint256) {
        return planBCertificate.getTokenForOwner(student, eventId);
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
}
