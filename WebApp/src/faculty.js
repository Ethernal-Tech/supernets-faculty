import web3 from './web3';

const address = '0xB76363D288202a4e646848361D602DaaC61d505E';
const abi = [{
	"inputs": [],
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "id",
		"type": "address"
	}, {
		"internalType": "string",
		"name": "name",
		"type": "string"
	}],
	"name": "addProfessor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "id",
		"type": "address"
	}, {
		"internalType": "string",
		"name": "name",
		"type": "string"
	}],
	"name": "addStudent",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "string",
		"name": "name",
		"type": "string"
	}, {
		"internalType": "address",
		"name": "professor",
		"type": "address"
	}],
	"name": "addSubject",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "admin",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "address",
		"name": "student",
		"type": "address"
	}],
	"name": "enrollSubject",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "getAllProfessors",
	"outputs": [{
		"components": [{
			"internalType": "address",
			"name": "id",
			"type": "address"
		}, {
			"internalType": "string",
			"name": "name",
			"type": "string"
		}, {
			"internalType": "uint256[]",
			"name": "subjects",
			"type": "uint256[]"
		}],
		"internalType": "struct Faculty.ProfessorView[]",
		"name": "",
		"type": "tuple[]"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "getAllStudents",
	"outputs": [{
		"components": [{
			"internalType": "address",
			"name": "id",
			"type": "address"
		}, {
			"internalType": "string",
			"name": "name",
			"type": "string"
		}, {
			"internalType": "uint256[]",
			"name": "subjects",
			"type": "uint256[]"
		}],
		"internalType": "struct Faculty.StudentView[]",
		"name": "",
		"type": "tuple[]"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "getAllSubjects",
	"outputs": [{
		"components": [{
			"internalType": "uint256",
			"name": "id",
			"type": "uint256"
		}, {
			"internalType": "string",
			"name": "name",
			"type": "string"
		}, {
			"internalType": "address",
			"name": "professorAddress",
			"type": "address"
		}, {
			"internalType": "string",
			"name": "professorName",
			"type": "string"
		}, {
			"internalType": "address[]",
			"name": "students",
			"type": "address[]"
		}],
		"internalType": "struct Faculty.SubjectView[]",
		"name": "",
		"type": "tuple[]"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "student",
		"type": "address"
	}],
	"name": "getAverageGrade",
	"outputs": [{
		"internalType": "string",
		"name": "averageGrade",
		"type": "string"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "student",
		"type": "address"
	}],
	"name": "getNumberOfPassedSubjects",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "professor",
		"type": "address"
	}],
	"name": "getProfessorSubjects",
	"outputs": [{
		"internalType": "uint256[]",
		"name": "subjectsIds",
		"type": "uint256[]"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "student",
		"type": "address"
	}],
	"name": "getStudentGrades",
	"outputs": [{
		"components": [{
			"internalType": "uint256",
			"name": "id",
			"type": "uint256"
		}, {
			"internalType": "uint256",
			"name": "grade",
			"type": "uint256"
		}],
		"internalType": "struct Faculty.GradeView[]",
		"name": "",
		"type": "tuple[]"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "student",
		"type": "address"
	}],
	"name": "getStudentSubjects",
	"outputs": [{
		"internalType": "uint256[]",
		"name": "",
		"type": "uint256[]"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "subject",
		"type": "uint256"
	}, {
		"internalType": "address",
		"name": "student",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "grade",
		"type": "uint256"
	}],
	"name": "gradeStudent",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"name": "professors",
	"outputs": [{
		"internalType": "string",
		"name": "name",
		"type": "string"
	}, {
		"internalType": "bool",
		"name": "exist",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"name": "students",
	"outputs": [{
		"internalType": "string",
		"name": "name",
		"type": "string"
	}, {
		"internalType": "bool",
		"name": "exist",
		"type": "bool"
	}, {
		"internalType": "uint256",
		"name": "subjectCount",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"name": "subjects",
	"outputs": [{
		"internalType": "string",
		"name": "name",
		"type": "string"
	}, {
		"internalType": "bool",
		"name": "exist",
		"type": "bool"
	}, {
		"internalType": "address",
		"name": "professor",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}]

export default new web3.eth.Contract(abi, address)
