// SPDX-License-Identifier: None

pragma solidity ^0.8.15;

import "./PlanBCertificate.sol";

contract Faculty {

    enum CourseAttendance{ NOT_ENROLLED, GRADE1, GRADE2, GRADE3, GRADE4, GRADE5, FAILED, ENROLLED }
    enum AddressArrayType{ ADMIN_ADDR, PROF_ADDR, STUD_ADDR, COURSE_STUD }
    enum UintArrayType { COURSES_IDS, PROF_COURSES, STUD_COURSES }

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

    struct StudentGrade {
        address studentAddress;
        CourseAttendance courseAttendance;
    }

    struct CoursesParams {
        string  title;
        string  description;
        uint256 startTime;
        uint256 endTime;
        string venue;
        uint points;
        address profAddress;
        uint studentsCount;
        bool exist;
    }

    struct PersonParams {
        string firstName;
        string lastName;
        string country;
        string expertise;

        uint coursesCount;
        bool exist;
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
    
    uint256 public maxEventId;
    uint256 public maxCourseId;

    uint256 public eventCount;

    mapping(uint => Event) public events;
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

    function generateCertificate(address studentAddress, string memory uri, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(events[eventId].students[studentAddress].exist == true, "Student not found.");
        planBCertificate.safeMint(studentAddress, uri, eventId);
    }

    function getCertificateId(address student, uint eventId) external view returns (uint256) {
        return planBCertificate.getTokenForOwner(student, eventId);
    }

    function getAddresses(uint eventId, AddressArrayType arrayType, uint courseId) external view returns(address[] memory) {
        if (arrayType == AddressArrayType.ADMIN_ADDR) {
            return events[eventId].adminsAddresses;
        } else if (arrayType == AddressArrayType.PROF_ADDR) {
            return events[eventId].professorsAddresses;
        } else if (arrayType == AddressArrayType.STUD_ADDR) {
            return events[eventId].studentsAddresses;
        } else if (arrayType == AddressArrayType.COURSE_STUD) {
            return events[eventId].courses[courseId].students;
        }
        
        revert(); 
    }

    function getCoursesIds(uint eventId, UintArrayType arrayType, address userAddres) external view returns(uint[] memory) {
        if (arrayType == UintArrayType.COURSES_IDS) {
            return events[eventId].coursesIds;
        } else if (arrayType == UintArrayType.PROF_COURSES) {
            return events[eventId].professors[userAddres].eventCourses;
        } else if (arrayType == UintArrayType.STUD_COURSES) {
            return events[eventId].students[userAddres].eventCourses;
        }
        
        revert(); 
    }

    function getCourse(uint eventId, uint courseId) external view returns(CoursesParams memory) {
        Course storage course = events[eventId].courses[courseId];
        return CoursesParams (
            course.title, 
            course.description,
            course.startTime, 
            course.endTime,
            course.venue, 
            course.points,
            course.professor,
            course.studentsCount, 
            course.exist
        );
    }

    function getProfessor(uint eventId, address profAddr) external view returns(PersonParams memory) {
        Professor storage prof = events[eventId].professors[profAddr];

        return PersonParams (
            prof.firstName,
            prof.lastName,
            prof.country,
            prof.expertise,
            prof.coursesCount,
            prof.exist
        );
    }

    function getStudent(uint eventId, address studAddr) external view returns(PersonParams memory) {
        Student storage student = events[eventId].students[studAddr];

        return PersonParams (
            student.firstName,
            student.lastName,
            student.country,
            "",
            student.coursesCount,
            student.exist
        );
    }

    function isStudentEnrolled(uint eventId, uint courseId, address studAddr) external view returns(bool) {
        return events[eventId].courses[courseId].enrolledStudents[studAddr];
    }

    function getGrade(uint eventId, uint courseId, address studAddr)external view returns(CourseAttendance) {
        return  events[eventId].students[studAddr].coursesAttendance[courseId];
    }

    // Private functions

    function isAdmin(uint eventId, address addr) public view returns(bool) {
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
