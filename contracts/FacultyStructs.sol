// SPDX-License-Identifier: None

pragma solidity ^0.8.15;

library FacultyStructs {

    enum CourseGrade{ NOT_ENROLLED, GRADE1, GRADE2, GRADE3, GRADE4, GRADE5, FAILED, ENROLLED }
    
    struct Event {
        uint id;
        string title;
        string location;
        string venue;
        uint256 startDate;
        uint256 endDate;
        string description;

        address[] adminsAddresses;
        address[] professorsAddresses;
        address[] studentsAddresses;
        uint[] coursesIds;

        bool exist;
    }

    struct Course {
        uint id;
        string title;
        string description;
        uint256 startTime;
        string venue;
        uint points;

        address professor;
        address[] students;

        bool exist;
    }

    struct Professor {
        address id;
        string firstName;
        string lastName;
        string country;
        string expertise;

        uint[] eventCourses;
        bool exist;
    }

    struct Student {
        address id;
        string firstName;
        string lastName;
        string country;

        uint[] eventCourses;   
        bool exist;
    }

    struct StudentGrade {
        address studentAddress;
        CourseGrade courseGrade;
    }
}