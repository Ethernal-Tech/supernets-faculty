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
            if (ev.exist){
                eventsArray[count++] = ev;
            }
        }

        return eventsArray;
    }

    function getEvent(uint eventId) external view returns(FacultyStructs.Event memory ev) {
        ev = faculty.getEvent(eventId);
        require(ev.exist);
    }

    function getAllCourses(uint eventId) external view returns(FacultyStructs.Course[] memory) {
        FacultyStructs.Event memory ev = faculty.getEvent(eventId);
        require(ev.exist);
        return faculty.getCourses(ev.coursesIds);
    }

    function getAllAdmins(uint eventId) external view returns(address[] memory) {
        FacultyStructs.Event memory ev = faculty.getEvent(eventId);
        require(ev.exist);

        return ev.adminsAddresses;
    }

    function getAllProfessors(uint eventId) external view returns(FacultyStructs.Professor[] memory) {
        FacultyStructs.Event memory ev = faculty.getEvent(eventId);
        require(ev.exist);

        return faculty.getProfessors(eventId, ev.professorsAddresses);
    }

    function getProfessorCourses(address professorAddress, uint eventId) external view returns(uint[] memory) {
        require(faculty.getEvent(eventId).exist);

        address[] memory profAddrParam = new address[](1);
        profAddrParam[0] = professorAddress;
        return faculty.getProfessors(eventId, profAddrParam)[0].eventCourses;
    }

    function getAllStudents(uint eventId) external view returns(FacultyStructs.Student[] memory) {
        FacultyStructs.Event memory ev = faculty.getEvent(eventId);
        require(ev.exist);

        return faculty.getStudents(eventId, ev.studentsAddresses);
    }

    function getStudentCourses(address studentAddress, uint eventId) external view returns(uint[] memory) {
        require(faculty.getEvent(eventId).exist);

        address[] memory studAddrParam = new address[](1);
        studAddrParam[0] = studentAddress;
        return faculty.getStudents(eventId, studAddrParam)[0].eventCourses;
    }

    function getStudentGrades(address studAddress, uint eventId) external view returns(GradeView[] memory) {
        require(faculty.getEvent(eventId).exist);

        address[] memory studAddrParam = new address[](1);
        studAddrParam[0] = studAddress;
        FacultyStructs.Student memory student = faculty.getStudents(eventId, studAddrParam)[0];
        require(student.exist == true);

        GradeView[] memory grades = new GradeView[](student.eventCourses.length);
        FacultyStructs.CourseGrade[] memory gradesArray = faculty.getGrades(studAddress, student.eventCourses);
        
        for (uint i = 0; i < student.eventCourses.length; i++) {
            grades[i] = GradeView(student.eventCourses[i], gradesArray[i]);    
        }

        return grades;
    }
}