import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Contact } from '../models/contact.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  styleUrls: ['./contact.component.scss'],
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
})
export class ContactComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  searchKeyword: string = '';
  contactForm: FormGroup;
  editMode: boolean = false;
  selectedContactId: number | null = null;
  sortColumn: string = ''; // Track the current column being sorted
  sortDirection: boolean = true;

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadContacts();
  }
  loadContacts(): void {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        console.log(data);
       this.contacts = data;
       this.filteredContacts = this.contacts;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
      },
    });
    
  }
  // Search function that filters based on the keyword
  searchContacts(): void {
    this.filteredContacts = this.contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
      contact.email.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }
  sortContacts(column: string): void {
    if (this.sortColumn === column) {
      // If the same column is clicked, toggle the sort direction
      this.sortDirection = !this.sortDirection;
    } else {
      // Otherwise, set the sort column and default to ascending
      this.sortColumn = column;
      this.sortDirection = true;
    }

    // Perform sorting
    this.contacts.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortDirection ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection ? 1 : -1;
      }
      return 0; // Equal values
    });
  }
// Open modal to add/edit contact
openModal(contact: Contact | null): void {
  this.editMode = !!contact;

  if (contact) {
    this.selectedContactId = contact.id;
    this.contactForm.setValue({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email
    });
  } else {
    this.selectedContactId = null;
    this.contactForm.reset();
  }
}

// Save contact
onSubmit(): void {
  if (this.contactForm.valid) {
    const contact: Contact = this.contactForm.value;
    if (this.editMode && this.selectedContactId !== null) {
      this.contactService
        .updateContact(this.selectedContactId, contact)
        .subscribe(() => {
          this.loadContacts();
        });
    } else {
      this.contactService.addContact(contact).subscribe(() => {
        this.loadContacts();
      });
    }
    this.loadContacts();
    window.location.reload();
  }
}
  deleteContact(id: number): void {
    this.contactService.deleteContact(id).subscribe(() => this.loadContacts());
  }
}
