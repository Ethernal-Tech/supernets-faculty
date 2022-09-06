// SPDX-License-Identifier: None

pragma solidity ^0.8.15;

import "./Faculty.sol";

contract FacultyReader {

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
        Faculty.CourseAttendance courseAttendance;
    }

    modifier eventExists(uint eventId) {
        (,,,,,,,,,bool exist) = faculty.events(eventId);
        require(exist == true);
        _;
    }

    Faculty faculty;

    constructor(address facultyAddress) {
        faculty = Faculty(facultyAddress);   
    }


    function getAllEvents() external view returns(EventView[] memory) {
        EventView[] memory eventsArray = new EventView[](faculty.eventCount());
        uint count = 0;

        for (uint i = 1; i <= faculty.maxEventId(); i++) {
            (string memory title, string memory location, string memory venue, uint256 time, string memory desc,,,,,bool exist) = faculty.events(i);
            if (exist == true){
                eventsArray[count++] = EventView({
                    eventId: i,
                    title: title,
                    location: location,
                    venue: venue,
                    time: time,
                    description: desc
                });
            }
        }

        return eventsArray;
    }

    function getAllCourses(uint eventId) external view eventExists(eventId) returns(CourseView[] memory) {
        (,,,,,,,,uint coursesCount,) = faculty.events(eventId);
        CourseView[] memory coursesArray = new CourseView[](coursesCount);
        uint count = 0;

        uint256[] memory coursesIds = faculty.getCoursesIds(eventId, Faculty.UintArrayType.COURSES_IDS, address(0));

        for (uint i = 0; i < coursesIds.length; i++) {
            Faculty.CoursesParams memory coursesParams = faculty.getCourse(eventId, coursesIds[i]);
            
            if (coursesParams.exist) {                
                coursesArray[count] = CourseView(
                    coursesIds[i], 
                    coursesParams.title, 
                    coursesParams.description, 
                    coursesParams.startTime, 
                    coursesParams.endTime, 
                    coursesParams.venue, 
                    coursesParams.points, 
                    address(0), "", 
                    new address[](coursesParams.studentsCount));

                {
                    Faculty.PersonParams memory prof = faculty.getProfessor(eventId, coursesParams.profAddress);
                    if (prof.exist) {
                        coursesArray[count].professorAddress = coursesParams.profAddress;
                        coursesArray[count].professorName = string(abi.encodePacked(prof.firstName, " ", prof.lastName));
                    }
                }

                uint studentsCounter;
                address[] memory studentsAddrs = faculty.getAddresses(eventId, Faculty.AddressArrayType.COURSE_STUD, coursesIds[i]);
                for (uint j = 0; j < studentsAddrs.length; j++) {

                    if (faculty.isStudentEnrolled(eventId, coursesIds[i], studentsAddrs[j])) {
                        coursesArray[count].students[studentsCounter++] = studentsAddrs[j];
                    }
                }

                count++;
            }
        }

        return coursesArray;
    }

    function getAllAdmins(uint eventId) external view eventExists(eventId) returns(address[] memory) {
        (,,,,,uint adminsCount,,,,) = faculty.events(eventId);
        address[] memory adminsAddresses = new address[](adminsCount);
        uint count = 0;

        address[] memory allAdminsAddresses = faculty.getAddresses(eventId, Faculty.AddressArrayType.ADMIN_ADDR, 0);
        for (uint i = 0; i < allAdminsAddresses.length; i++) {
            if (faculty.isAdmin(eventId, allAdminsAddresses[i])) {
                adminsAddresses[count++] = adminsAddresses[i];
            }
        }

        return adminsAddresses;
    }

    function getAllProfessors(uint eventId) external view eventExists(eventId) returns(ProfessorView[] memory) { 
        (,,,,,,uint profCount,,,) = faculty.events(eventId);  
        ProfessorView[] memory professorsArray = new ProfessorView[](profCount);      
        uint profCounter = 0;

        address[] memory allProfsAddresses = faculty.getAddresses(eventId, Faculty.AddressArrayType.PROF_ADDR, 0);
        for (uint i = 0; i < allProfsAddresses.length; i++) {
            Faculty.PersonParams memory prof = faculty.getProfessor(eventId, allProfsAddresses[i]);

            if (prof.exist) {
                professorsArray[profCounter] = ProfessorView(allProfsAddresses[i], prof.firstName, prof.lastName, prof.country, prof.expertise, new uint[](prof.coursesCount)); 

                uint courseCount = 0;
                uint[] memory profCourses = faculty.getCoursesIds(eventId, Faculty.UintArrayType.PROF_COURSES, allProfsAddresses[i]);
                for (uint j = 0; j < profCourses.length; j++) {
                    Faculty.CoursesParams memory coursesParams = faculty.getCourse(eventId, profCourses[j]);
                    if (coursesParams.exist) {
                        professorsArray[profCounter].courses[courseCount++] = profCourses[j];
                    }
                }

                profCounter++;
            }
        }

        return professorsArray;
    }

    function getAllStudents(uint eventId) external view eventExists(eventId) returns(StudentView[] memory) {
        (,,,,,,,uint studentsCount,,) = faculty.events(eventId);
        StudentView[] memory studentsArray = new StudentView[](studentsCount);
        uint studentCounter = 0;

        address[] memory allStudsAddresses = faculty.getAddresses(eventId, Faculty.AddressArrayType.STUD_ADDR, 0);
        for (uint i = 0; i < allStudsAddresses.length; i++) {
            Faculty.PersonParams memory student = faculty.getStudent(eventId, allStudsAddresses[i]);

            if (student.exist) {
                studentsArray[studentCounter] = StudentView(allStudsAddresses[i], student.firstName, student.lastName, student.country, new uint[](student.coursesCount));

                uint courseCount = 0;
                uint[] memory studCourses = faculty.getCoursesIds(eventId, Faculty.UintArrayType.STUD_COURSES, allStudsAddresses[i]);
                for (uint j = 0; j < studCourses.length; j++) {
                    Faculty.CoursesParams memory coursesParams = faculty.getCourse(eventId, studCourses[j]);
                    if (coursesParams.exist) {
                        studentsArray[studentCounter].courses[courseCount++] = studCourses[j];
                    }
                }

                studentCounter++;
            }
        }

        return studentsArray;
    }

    function getStudentGrades(address studAddress, uint eventId) external view eventExists(eventId) returns(GradeView[] memory) {
        Faculty.PersonParams memory student = faculty.getStudent(eventId, studAddress);
        require(student.exist == true);

        GradeView[] memory grades = new GradeView[](student.coursesCount);
        uint count = 0;
        
        uint[] memory studCourses = faculty.getCoursesIds(eventId, Faculty.UintArrayType.STUD_COURSES, studAddress);
        for (uint i = 0; i < studCourses.length; i++) {
            Faculty.CourseAttendance grade = faculty.getGrade(eventId, studCourses[i], studAddress);
            if (grade != Faculty.CourseAttendance.NOT_ENROLLED) {
                grades[count++] = GradeView({
                    courseId: studCourses[i],
                    courseAttendance: grade
                }); 
            }     
        }

        return grades;
    }

    function getProfessorCourses(address professor, uint eventId) external view eventExists(eventId) returns(uint[] memory) {
        Faculty.PersonParams memory prof = faculty.getProfessor(eventId, professor);
        require(prof.exist == true);

        uint[] memory coursesIds = new uint[](prof.coursesCount);
        uint count = 0;

        uint[] memory profCourses = faculty.getCoursesIds(eventId, Faculty.UintArrayType.PROF_COURSES, professor);
        for (uint i = 0; i < profCourses.length; i++) {
            Faculty.CoursesParams memory coursesParams = faculty.getCourse(eventId, profCourses[i]);
            if (coursesParams.exist) {
                coursesIds[count++] = profCourses[i];
            }
        }

        return coursesIds;
    }
    
    function getStudentCourses(address studentAddress, uint eventId) external view eventExists(eventId) returns(uint[] memory) {
        Faculty.PersonParams memory student = faculty.getStudent(eventId, studentAddress);
        require(student.exist == true);

        uint[] memory coursesIds = new uint[](student.coursesCount);
        uint count = 0;

        uint[] memory studCourses = faculty.getCoursesIds(eventId, Faculty.UintArrayType.STUD_COURSES, studentAddress);
        for (uint i = 0; i < studCourses.length; i++) {
            Faculty.CoursesParams memory coursesParams = faculty.getCourse(eventId, studCourses[i]);
            if (coursesParams.exist) {
                coursesIds[count++] = studCourses[i];
            }
        }

        return coursesIds;
    }
}