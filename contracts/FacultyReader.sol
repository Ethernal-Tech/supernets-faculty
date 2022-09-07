// SPDX-License-Identifier: None

pragma solidity ^0.8.15;

import "./FacultyState.sol";
import "./FacultyStructs.sol";

contract FacultyReader {

    struct GradeView {
        uint courseId;
        FacultyStructs.CourseGrade courseGrade;
    }

    FacultyState faculty;

    constructor(address facultyAddress) {
        faculty = FacultyState(facultyAddress);   
    }

    function getAllEvents() external view returns(FacultyStructs.Event[] memory) {
        FacultyStructs.Event[] memory eventsArray = new FacultyStructs.Event[](faculty.eventCount());
        uint count = 0;

        for (uint i = 1; i <= faculty.maxEventId(); i++) {
            FacultyStructs.Event memory ev = faculty.getEvent(i);
            if (ev.exist == true){
                eventsArray[count++] = ev;
            }
        }

        return eventsArray;
    }

    function getAllCourses(uint eventId) external view returns(FacultyStructs.Course[] memory) {
        FacultyStructs.Event memory ev = faculty.getEvent(eventId);
        require(ev.exist);

        FacultyStructs.Course[] memory coursesArray = new FacultyStructs.Course[](ev.coursesIds.length);
        for (uint i = 0; i < ev.coursesIds.length; i++) {
            coursesArray[i] = faculty.getCourse(ev.coursesIds[i]);
        }

        return coursesArray;
    }

    function getAllAdmins(uint eventId) external view returns(address[] memory) {
        FacultyStructs.Event memory ev = faculty.getEvent(eventId);
        require(ev.exist);

        return ev.adminsAddresses;
    }

    function getAllProfessors(uint eventId) external view returns(FacultyStructs.Professor[] memory) {
        FacultyStructs.Event memory ev = faculty.getEvent(eventId);
        require(ev.exist);

        FacultyStructs.Professor[] memory profArray = new FacultyStructs.Professor[](ev.professorsAddresses.length);
        for (uint i = 0; i < ev.professorsAddresses.length; i++) {
            profArray[i] = faculty.getProfessor(eventId, ev.professorsAddresses[i]);
        }

        return profArray;
    }

    function getProfessorCourses(address professorAddress, uint eventId) external view returns(uint[] memory) {
        require(faculty.getEvent(eventId).exist);
        return faculty.getProfessor(eventId, professorAddress).eventCourses;
    }

    function getAllStudents(uint eventId) external view returns(FacultyStructs.Student[] memory) {
        FacultyStructs.Event memory ev = faculty.getEvent(eventId);
        require(ev.exist);

        FacultyStructs.Student[] memory studentArray = new FacultyStructs.Student[](ev.studentsAddresses.length);
        for (uint i = 0; i < ev.studentsAddresses.length; i++) {
            studentArray[i] = faculty.getStudent(eventId, ev.studentsAddresses[i]);
        }

        return studentArray;
    }

    function getStudentCourses(address studentAddress, uint eventId) external view returns(uint[] memory) {
        require(faculty.getEvent(eventId).exist);
        return faculty.getStudent(eventId, studentAddress).eventCourses;
    }

    function getStudentGrades(address studAddress, uint eventId) external view returns(GradeView[] memory) {
        require(faculty.getEvent(eventId).exist);

        FacultyStructs.Student memory student = faculty.getStudent(eventId, studAddress);
        require(student.exist == true);

        GradeView[] memory grades = new GradeView[](student.eventCourses.length);
        
        for (uint i = 0; i < student.eventCourses.length; i++) {
            FacultyStructs.CourseGrade grade = faculty.getGrade(studAddress, student.eventCourses[i]);
            grades[i] = GradeView(student.eventCourses[i], grade);    
        }

        return grades;
    }
}