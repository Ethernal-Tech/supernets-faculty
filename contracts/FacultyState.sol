// SPDX-License-Identifier: None

pragma solidity ^0.8.15;

import "./PlanBCertificate.sol";
import "./FacultyStructs.sol";

contract FacultyState {

    modifier onlyAdmin {
        require (msg.sender == admin);
        _;
    }

    modifier eventAdmin(uint eventId) {
        require (isAdmin(eventId, msg.sender));
        _;
    }

    modifier eventExists(uint eventId) {
        require(events[eventId].exist);
        _;
    }

    modifier canAddAddress(uint eventId, address addr) {
        require(!addressExistsInArray(events[eventId].adminsAddresses, addr));
        require(!professors[getKey(addr, eventId)].exist);
        require(!students[getKey(addr, eventId)].exist);
        _;
    }

    address public admin;
    
    uint256 public maxEventId;
    uint256 public maxCourseId;
    uint256 public eventCount;

    mapping(uint => FacultyStructs.Event) events;
    mapping(uint => FacultyStructs.Course) courses;
    //key = address + eventId
    mapping(bytes => FacultyStructs.Professor) professors;
    mapping(bytes => FacultyStructs.Student) students;
    //key = address + courseId
    mapping(bytes => FacultyStructs.CourseGrade) grades;

    PlanBCertificate planBCertificate;

    constructor(address certificateAddress) {
        admin = msg.sender;
        maxEventId = 0;
        maxCourseId = 0;
        
        planBCertificate = PlanBCertificate(certificateAddress);   
    }

    //Events

    function addEvent(string calldata title, string calldata location, string calldata venue, uint256 startDate, uint256 endDate, string calldata description) external onlyAdmin {
        maxEventId ++;
        events[maxEventId].id = maxEventId;

        populateEvent(maxEventId, title, location, venue, startDate, endDate, description);
        eventCount ++;
    }

    function editEvent(uint eventId, string calldata title, string calldata location, string calldata venue, uint256 startDate, uint256 endDate, string calldata description) external onlyAdmin eventExists(eventId) {
        populateEvent(eventId, title, location, venue, startDate, endDate, description);
    }

    function deleteEvent(uint eventId) external onlyAdmin eventExists(eventId) {
        require(events[eventId].coursesIds.length == 0);
        events[eventId].exist = false;
        eventCount--;
    }

    //Courses

    function addCourse(string calldata title, string calldata description, uint256 startTime, string calldata venue, uint points, address professor, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(professors[getKey(professor, eventId)].exist);

        maxCourseId ++;
        courses[maxCourseId].id = maxCourseId;

        populateCourse(maxCourseId, title, description, startTime, venue, points, professor, eventId);
        events[eventId].coursesIds.push(maxCourseId);
    }

    function editCourse(uint courseId, string calldata title, string calldata description, uint256 startTime, string calldata venue, uint points, address professor, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(courses[courseId].exist);
        require(professors[getKey(professor, eventId)].exist);
        require(uintExistsInArray(events[eventId].coursesIds, courseId));

        populateCourse(courseId, title, description, startTime, venue, points, professor, eventId);
        
    }

    function deleteCourse(uint courseId, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(courses[courseId].exist);
        require(courses[courseId].students.length == 0);

        courses[courseId].exist = false;

        bytes memory professorKey = getKey(courses[courseId].professor, eventId);
        deleteUintFromArray(professors[professorKey].eventCourses, courseId);
        deleteUintFromArray(events[eventId].coursesIds, courseId);
    }

    //Event admins

    function addEventAdmin(uint eventId, address adminAddress) external onlyAdmin eventExists(eventId) canAddAddress(eventId, adminAddress) {
        events[eventId].adminsAddresses.push(adminAddress);
        planBCertificate.addEventAdmin(eventId, adminAddress);
    }

    function deleteEventAdmin(uint eventId, address adminAddress) external onlyAdmin eventExists(eventId) {
        require(addressExistsInArray(events[eventId].adminsAddresses, adminAddress));

        deleteAddressFromArray(events[eventId].adminsAddresses, adminAddress);
        planBCertificate.deleteEventAdmin(eventId, adminAddress);
    }

    //Professors

    function addProfessor(address profAddress, string calldata firstName, string calldata lastName, string calldata country, string calldata expertise, uint eventId) external eventAdmin(eventId) eventExists(eventId) canAddAddress(eventId, profAddress) {
        populateProfessor(profAddress, firstName, lastName, country, expertise, eventId);
        events[eventId].professorsAddresses.push(profAddress);
    }

    function editProfessor(address profAddress, string calldata firstName, string calldata lastName, string calldata country, string calldata expertise, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(professors[getKey(profAddress, eventId)].exist);
        populateProfessor(profAddress, firstName, lastName, country, expertise, eventId);
    }

    function deleteProfessor(address profAddress, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        bytes memory profKey = getKey(profAddress, eventId);
        require(professors[profKey].exist);

        for(uint i = 0; i < professors[profKey].eventCourses.length; i++) {
            uint courseId = professors[profKey].eventCourses[i];
            courses[courseId].professor = address(0);
        }

        deleteAddressFromArray(events[eventId].professorsAddresses, profAddress);
        professors[profKey].exist = false;
    }

    //Students

    function addStudent(address studentAddress, string calldata firstName, string calldata lastName, string calldata country, uint eventId) external eventAdmin(eventId) eventExists(eventId) canAddAddress(eventId, studentAddress) {
        populateStudent(studentAddress, firstName, lastName, country, eventId);
        events[eventId].studentsAddresses.push(studentAddress);
    }

    function editStudent(address studentAddress, string calldata firstName, string calldata lastName, string calldata country, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(students[getKey(studentAddress, eventId)].exist);
        populateStudent(studentAddress, firstName, lastName, country, eventId);
    }

    function deleteStudent(address studentAddress, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        bytes memory studentKey = getKey(studentAddress, eventId);
        require(students[studentKey].exist);

        for(uint i = 0; i < students[studentKey].eventCourses.length; i++) {
            uint courseId = students[studentKey].eventCourses[i];
            deleteAddressFromArray(courses[courseId].students, studentAddress);
        }

        deleteAddressFromArray(events[eventId].studentsAddresses, studentAddress);
        students[studentKey].exist = false;
    }

    function enrollCourseMultiple(uint courseId, address[] calldata studAddresses, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(courses[courseId].exist);

        for (uint i = 0; i < studAddresses.length; i++) {
            bytes memory studentKey = getKey(studAddresses[i], eventId);
            bytes memory gradeKey = getKey(studAddresses[i], courseId);

            require(students[studentKey].exist);
            require(grades[gradeKey] == FacultyStructs.CourseGrade.NOT_ENROLLED);

            courses[courseId].students.push(studAddresses[i]);
            students[studentKey].eventCourses.push(courseId);
            grades[gradeKey] = FacultyStructs.CourseGrade.ENROLLED;
        }
    }

    function disenrollCourseMultiple(uint courseId, address[] calldata studAddresses, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(courses[courseId].exist);

        for (uint i = 0; i < studAddresses.length; i++) {
            bytes memory studentKey = getKey(studAddresses[i], eventId);
            bytes memory gradeKey = getKey(studAddresses[i], courseId);

            require(students[studentKey].exist);
            require(grades[gradeKey] == FacultyStructs.CourseGrade.ENROLLED);

            deleteAddressFromArray(courses[courseId].students, studAddresses[i]);
            deleteUintFromArray(students[studentKey].eventCourses, courseId);
            grades[gradeKey] = FacultyStructs.CourseGrade.NOT_ENROLLED;
        }
    }

    function gradeStudents(uint courseId, FacultyStructs.StudentGrade[] memory studentGrades, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(courses[courseId].exist);

        for (uint i = 0; i < studentGrades.length; i++) {
            bytes memory studentKey = getKey(studentGrades[i].studentAddress, eventId);
            bytes memory gradeKey = getKey(studentGrades[i].studentAddress, courseId);

            require(students[studentKey].exist);
            require(grades[gradeKey] == FacultyStructs.CourseGrade.ENROLLED || grades[gradeKey] == FacultyStructs.CourseGrade.FAILED);

            require(studentGrades[i].courseGrade >= FacultyStructs.CourseGrade.GRADE1 && 
                studentGrades[i].courseGrade <= FacultyStructs.CourseGrade.FAILED);

            grades[gradeKey] = studentGrades[i].courseGrade;
        }
    }

    //Certificates

    function generateCertificate(address studentAddress, string memory uri, uint eventId) external eventAdmin(eventId) eventExists(eventId) {
        require(students[getKey(studentAddress, eventId)].exist);
        planBCertificate.safeMint(studentAddress, uri, eventId);
    }

    function getCertificateId(address studentAddress, uint eventId) external view returns (uint256) {
        return planBCertificate.getTokenForOwner(studentAddress, eventId);
    }

    //Getters

    function getEvent(uint eventId) external view returns(FacultyStructs.Event memory) {
        return events[eventId];
    }

    function getCourses(uint[] calldata coursesIds) external view returns(FacultyStructs.Course[] memory) {
        FacultyStructs.Course[] memory coursesArray = new FacultyStructs.Course[](coursesIds.length);
        for (uint i = 0; i < coursesIds.length; i++) {
            coursesArray[i] = courses[coursesIds[i]];
        }

        return coursesArray;
    }

    function getProfessors(uint eventId, address[] calldata profAddresses) external view returns(FacultyStructs.Professor[] memory) {
        FacultyStructs.Professor[] memory profsArray = new FacultyStructs.Professor[](profAddresses.length);

        for (uint i = 0; i < profAddresses.length; i++) {
            profsArray[i] = professors[getKey(profAddresses[i], eventId)];
        }

        return profsArray;
    }

    function getStudents(uint eventId, address[] calldata studentsAddresses) external view returns(FacultyStructs.Student[] memory) {
        FacultyStructs.Student[] memory studentsArray = new FacultyStructs.Student[](studentsAddresses.length);

        for (uint i = 0; i < studentsAddresses.length; i++) {
            studentsArray[i] = students[getKey(studentsAddresses[i], eventId)];
        }

        return studentsArray;
    }

    function getGrades(address studentAddress, uint[] calldata coursesIds) external view returns(FacultyStructs.CourseGrade[] memory) {
        FacultyStructs.CourseGrade[] memory gradesArray = new FacultyStructs.CourseGrade[](coursesIds.length);

        for (uint i = 0; i < coursesIds.length; i++) {
            gradesArray[i] = grades[getKey(studentAddress, coursesIds[i])];
        }

        return gradesArray;
    }

    //Private functions

    function isAdmin(uint eventId, address addr) private view returns(bool) {
        return (addressExistsInArray(events[eventId].adminsAddresses, addr)|| addr == admin);
    }

    function addressExistsInArray(address[] memory array, address value) private pure returns(bool) {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }

    function uintExistsInArray(uint[] memory array, uint value) private pure returns(bool) {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }

    function deleteAddressFromArray(address[] storage array, address value) private {
        uint index;
        bool found = false;

        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                index = i;
                found = true;
                break;
            }
        }

        require(found);

        array[index] = array[array.length - 1];
        array.pop();
    }

    function deleteUintFromArray(uint[] storage array, uint value) private {
        uint index;
        bool found = false;

        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                index = i;
                found = true;
                break;
            }
        }

        require(found);

        array[index] = array[array.length - 1];
        array.pop();
    }

    function getKey(address addr, uint eventId) private  pure returns(bytes memory) {
        return abi.encodePacked(addr, eventId);
    }

    //Populate functions

    function populateEvent(uint eventId, string calldata title, string calldata location, string calldata venue, uint256 startDate, uint256 endDate, string calldata description) private  {
        events[eventId].title = title;
        events[eventId].location = location;
        events[eventId].venue = venue;
        events[eventId].startDate = startDate;
        events[eventId].endDate = endDate;
        events[eventId].description = description;

        events[eventId].exist = true;
    }

    function populateCourse(uint courseId, string calldata title, string calldata description, uint256 startTime, string calldata venue, uint points, address professor, uint eventId) private {
        bytes memory professorKey = getKey(professor, eventId);
        
        courses[courseId].title = title;
        courses[courseId].description = description;
        courses[courseId].startTime = startTime;
        courses[courseId].venue = venue;
        courses[courseId].points = points;
        courses[courseId].exist = true;

        if (courses[courseId].professor != professor) {
            if (courses[courseId].professor != address(0)) {
                deleteUintFromArray(professors[professorKey].eventCourses, courseId);
            }
            
            courses[maxCourseId].professor = professor;         
            professors[professorKey].eventCourses.push(maxCourseId);
        }
    }

    function populateProfessor(address profAddress, string calldata firstName, string calldata lastName, string calldata country, string calldata expertise, uint eventId) private {
        bytes memory profKey = getKey(profAddress, eventId);
        
        professors[profKey].id = profAddress;
        professors[profKey].firstName = firstName;
        professors[profKey].lastName = lastName;
        professors[profKey].country = country;
        professors[profKey].expertise = expertise;
        professors[profKey].exist = true;
    }

    function populateStudent(address studentAddress, string calldata firstName, string calldata lastName, string calldata country, uint eventId) private {
        bytes memory studentKey = getKey(studentAddress, eventId);
        
        students[studentKey].id = studentAddress;
        students[studentKey].firstName = firstName;
        students[studentKey].lastName = lastName;
        students[studentKey].country = country;
        students[studentKey].exist = true;
    }
}