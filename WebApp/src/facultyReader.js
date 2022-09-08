import web3 from './web3';

export const address = '0x2248257a662C69f6CA2765E680DAA530Aa42B304';
const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "facultyAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "eventId",
                "type": "uint256"
            }
        ],
        "name": "getAllAdmins",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "eventId",
                "type": "uint256"
            }
        ],
        "name": "getAllCourses",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "venue",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "points",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "professor",
                        "type": "address"
                    },
                    {
                        "internalType": "address[]",
                        "name": "students",
                        "type": "address[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "exist",
                        "type": "bool"
                    }
                ],
                "internalType": "struct FacultyStructs.Course[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllEvents",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "location",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "venue",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startDate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endDate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "address[]",
                        "name": "adminsAddresses",
                        "type": "address[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "professorsAddresses",
                        "type": "address[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "studentsAddresses",
                        "type": "address[]"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "coursesIds",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "exist",
                        "type": "bool"
                    }
                ],
                "internalType": "struct FacultyStructs.Event[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "eventId",
                "type": "uint256"
            }
        ],
        "name": "getAllProfessors",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "id",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "firstName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "lastName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "country",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "expertise",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "eventCourses",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "exist",
                        "type": "bool"
                    }
                ],
                "internalType": "struct FacultyStructs.Professor[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "eventId",
                "type": "uint256"
            }
        ],
        "name": "getAllStudents",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "id",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "firstName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "lastName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "country",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "eventCourses",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "exist",
                        "type": "bool"
                    }
                ],
                "internalType": "struct FacultyStructs.Student[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "professorAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "eventId",
                "type": "uint256"
            }
        ],
        "name": "getProfessorCourses",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "studentAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "eventId",
                "type": "uint256"
            }
        ],
        "name": "getStudentCourses",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "studAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "eventId",
                "type": "uint256"
            }
        ],
        "name": "getStudentGrades",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "courseId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum FacultyStructs.CourseGrade",
                        "name": "courseGrade",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct FacultyReader.GradeView[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

export default new web3.eth.Contract(abi, address)