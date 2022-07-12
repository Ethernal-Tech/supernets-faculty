import React from "react";
import web3 from "./web3";
import faculty from "./faculty.js";

const adminAddress = '0x40f1F16e92884C78E4bE49e8D8c4BFA2A81A447d';

class App extends React.Component {
  state = {
    AllProfessors: [],
    AllStudents: [],
    accounts: [],
    gasPrice: undefined,
    profName: "",
    profAddress: ""
  };
  async componentDidMount() {

    const AllProfessors = await faculty.methods.getAllProfessors().call();
    const AllStudents = await faculty.methods.getAllStudents().call();
    const accounts = await web3.eth.getAccounts();
    const gasPrice = await web3.eth.getGasPrice();

    this.setState({ AllProfessors, AllStudents, accounts, gasPrice });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });
    try {
      await faculty.methods.addProfessor(this.state.profAddress, this.state.profName).send({
        from: accounts[0]
      });

      this.setState({ message: "Professor added!" });
    }
    catch (err) {
      this.setState({ message: err.message });
    }
  };

  onSubmitStudent = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });
    try {
      await faculty.methods.addStudent(this.state.studAddress, this.state.studName).send({
        from: accounts[0]
      });

      this.setState({ message: "Student added!" });
    }
    catch (err) {
      this.setState({ message: err.message });
    }

  };
  
  render() {
    const profs = this.state.AllProfessors.map((d) => <li key={d.name}>{d.name}</li>);
    const studs = this.state.AllStudents.map((d) => <li key={d.name}>{d.name}</li>);
    return (
      <div>
        Current user: <br></br><span>{this.state.accounts[0]}</span>
        <hr></hr>
        <h3>Professors</h3>
        <ul>
          {profs}
        </ul>
        <form onSubmit={this.onSubmit}>
          <h4>Add professor</h4>
          <div>
            <label>Name: </label>
            <input
              value={this.state.profName}
              onChange={(event) => this.setState({ profName: event.target.value })}
            /><br></br>
            <br></br>
            <label>Address: </label>
            <input
              value={this.state.profAddress}
              onChange={(event) => this.setState({ profAddress: event.target.value })}
            />
            <br></br>
            <br></br>
          </div>
          <button>Add</button>
        </form>
        <hr></hr>
        <h3>Students</h3>
        <ul>
          {studs}
        </ul>
       
        <form onSubmit={this.onSubmitStudent}>
          <h4>Add student</h4>
          <div>
            <label>Name: </label>
            <input
              value={this.state.studName}
              onChange={(event) => this.setState({ studName: event.target.value })}
            /><br></br>
            <br></br>
            <label>Address: </label>
            <input
              value={this.state.studAddress}
              onChange={(event) => this.setState({ studAddress: event.target.value })}
            />
            <br></br>
            <br></br>
          </div>
          <button>Add</button>
        </form>

        <hr />


        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
