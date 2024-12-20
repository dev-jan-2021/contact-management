import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'https://localhost:44322/api/contacts';
  
  constructor(private http: HttpClient) {}
  
  getContacts(): Observable<Contact[]> {
    //console.log(this.apiUrl);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<Contact[]>(this.apiUrl,{headers});
  }

  addContact(contact: Contact): Observable<Contact> {
    console.log(contact);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<Contact>(this.apiUrl, contact,{headers});
  }

  updateContact(id: number,contact: Contact): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<void>(`${this.apiUrl}/${id}`, contact,{headers});
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
