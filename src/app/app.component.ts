import {Component, OnInit} from '@angular/core';
import {Employee} from "./Employee";
import {EmployeeService} from "./employee.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'EmployeeManager';

  public employees: Employee[];
  public editEmployee: Employee;
  public deleteEmployee: Employee;

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(employee: any, mode: string): void {
    const container = document.getElementById("main-container");

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');

    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#editEmployeeModal');

    } if(mode === 'delete') {
      this.deleteEmployee= employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');

    }
    // @ts-ignore
    container.appendChild(button);
    button.click();

  }

  onAddEmployee(addForm: NgForm): void {
    // @ts-ignore
    document.getElementById("add-employee-form").click();
    //the value of the form is a Json
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        this.getEmployees();
        addForm.reset();
      },

      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }
  onUpdateEmployee(employee: Employee): void {
    //the value of the form is a Json
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        this.getEmployees();
      },

      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        this.getEmployees();
      },

      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key: string): void {
    const result: Employee[] = [];
    for(const e of this.employees)
    {
      //we found it
      if(e.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || e.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || e.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        result.push(e);
      }
    }
    this.employees = result;

    if(result.length ===0 || !key) {
      this.getEmployees();
    }
  }
}
