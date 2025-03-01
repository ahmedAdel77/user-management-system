// Angular
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
// PrimeNg
import { TableModule, Table } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService } from 'primeng/api';
// translate
import { TranslateModule, TranslateService } from '@ngx-translate/core';
// Services
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
// Models
import { User } from '../../models/user.model';
// Enums
import { Status } from '../../enums/status.enum';
import { Role } from '../../enums/role.enum';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, IconFieldModule, InputIconModule, ButtonModule, DialogModule, ConfirmDialogModule, ToastModule, InputTextModule, InputGroupModule, InputGroupAddonModule, TagModule, CardModule, TranslateModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  /** User */
  users: User[] = [];
  /** Active Users */
  activeUsers: User[] = [];
  /** Search Value */
  searchValue: string = '';
  /** Loading */
  loading: boolean = true;
  /** Add Edit Dialog */
  addEditDialog: boolean = false;
  /** Edit Mode */
  isEditMode: boolean = false;
  /** Selected User */
  selectedUser!: User;
  /** role */
  role: Role | "" = Role.USER;
  /** Role Enum */
  RoleEnum = Role;
  /** Status Enum */
  StatusEnum = Status;
  /** Data Table Reference */
  @ViewChild('dt') dt!: Table;
  /** usersSubscription$ */
  usersSubscription$: Observable<User[]> | undefined;
  /** destroy$ */
  private destroy$ = new Subject<void>(); // Subject for unsubscribing
  /** userAddEditForm */
  userAddEditForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    status: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
  });

  public get name(): FormControl {
    return this.userAddEditForm.get('name') as FormControl;
  }
  public get email(): FormControl {
    return this.userAddEditForm.get('email') as FormControl;
  }
  public get phone(): FormControl {
    return this.userAddEditForm.get('phone') as FormControl;
  }

  /**
   * Constructor
   * @param userService
   * @param confirmationService
   * @param messageService
   */
  constructor(private userService: UserService, private confirmationService: ConfirmationService, private messageService: MessageService, private translate: TranslateService, private authService: AuthService) { }

  /** ngOnInit lifecycle hook */
  ngOnInit() {
    this.authService.getRole().pipe(takeUntil(this.destroy$)).subscribe(role => this.role = role);
    this.loadUsers();
  }

  /** loadUsers */
  loadUsers(): void {
    this.userService.getUsers().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.users = data;
      this.activeUsers = this.users.filter(user => user.status === Status.ACTIVE);
      this.loading = false;
    });
  }

  /** Clear
   * @param table
   * Clears the search value
   */
  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  /**
   * getUser
   * @param id
   * @returns User
   */
  getUser(id: number): User | undefined {
    return this.users.find((u) => u.id === id) || undefined;
  }

  /**
   * filter
   * Filters the table based on user input
   */
  filter() {
    this.dt.filterGlobal(this.searchValue, 'contains');
  }

  /** openUserDialog
   *  @param user optional
   */
  openUserDialog(user?: User): void {
    this.isEditMode = !!user;
    if (this.isEditMode && user) this.selectedUser = user;
    this.addEditDialog = true;
    this.userAddEditForm.reset();
    if (user) this.userAddEditForm.patchValue(user);
  }

  /** saveUser */
  saveUser() {
    this.userAddEditForm.markAllAsTouched();
    if (this.userAddEditForm.invalid) return;
    this.isEditMode ? this.userService.updateUser({ ...this.userAddEditForm.value }) : this.userService.addUser(this.userAddEditForm.value);
    this.messageService.add({ severity: 'success', summary: this.translate.instant('OperationSucceeded'), detail: (this.isEditMode ? this.translate.instant('UserEditSuccess') : this.translate.instant('UserAddSuccess')) });
    this.addEditDialog = false;
    this.loadUsers();
  }

  /** openDeleteDialog */
  openDeleteDialog(event: Event, user: User) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.translate.instant('DeleteUser'),
      message: this.translate.instant('DeleteUserMessage', { name: user.name }),
      icon: 'pi pi-info-circle',
      rejectLabel: this.translate.instant('Cancel'),
      acceptButtonProps: {
        label: this.translate.instant('Delete'),
        severity: 'danger',
      },

      accept: () => {
        this.userService.deleteUser(user.id);
        this.loadUsers();
        this.messageService.add({ severity: 'success', summary: this.translate.instant('OperationSucceeded'), detail: this.translate.instant('UserDeleteSuccess') });
      },
    });
  }
}
