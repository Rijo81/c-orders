import { Component, OnInit } from '@angular/core';
import { UsersI } from 'src/app/models/userss.models';
import { UsersService } from 'src/app/services/user/users.service';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonLabel, IonList,
  IonItem, IonAvatar,  IonMenuButton, IonImg, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from "@ionic/angular/standalone";
import { RequestI } from 'src/app/models/requests.models';
import { GroupI } from 'src/app/models/groups.models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ViewreceivedService } from 'src/app/services/recevied/viewreceived.service';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonImg,  IonLabel, IonContent, IonButtons, IonTitle, IonToolbar,
    IonHeader, IonMenuButton, CommonModule ]
})
export class ReceivedComponent implements OnInit {
  users: UsersI[] = [];
  groups: GroupI[] = [];
  requests: RequestI[] = [];
  filteredRequests: RequestI[] = [];
  iLogo: string = 'assets/logo.png';
  selectedUser: UsersI | null = null;
  selectedGroup: GroupI | null = null;
  constructor(private router: Router, private reqViewService: ViewreceivedService) {
    //this.loadUsers();
  }

  objectKeys(obj: Record<string, any>): string[] {
    return Object.keys(obj);
  }

  ngOnInit() {

    this.filteredRequests = this.reqViewService.getReq();

    const storeRequests = localStorage.getItem('requests');
    if (storeRequests) {
      this.requests = JSON.parse(storeRequests);
    }
    const storedGroups = localStorage.getItem('groups');
    if (storedGroups) {
      this.groups = JSON.parse(storedGroups);
    }
    const storeUser = localStorage.getItem('users');
    if (storeUser) {
      this.selectedUser = JSON.parse(storeUser);
    }
    this.selectedUser.group_id = 2;

    if (!this.selectedUser || !this.selectedUser.group_id) {
      console.error('Error: Usuario no válido o sin group_id.');
      return;
    }
    console.log('Loaded Solicitudes Recibidas ahora:', this.requests);

     this.filteredRequests = this.getRequestsForDestineGroup(this.selectedUser.group_id);
     console.log('Loaded ahora:', this.filteredRequests);
  }

  isImage(value: string): boolean {
    return typeof value === 'string' && (value.startsWith('data:image') || value.startsWith('http'));
  }

  isStringOrNumber(value: any): boolean {
    return typeof value === 'string' || typeof value === 'number';
  }
  getRequestsForDestineGroup(userGroupId: number): RequestI[] {
    console.log(userGroupId);

    const userHierarchy = this.getAllParetsGroups(userGroupId, this.groups);
    return this.requests.filter(request => {

      if (request.group_destine && request.group_destine.id !== undefined) {
        return userHierarchy.includes(request.group_destine.id);
      }
      return false;
    }
    );
  }
  getAllParetsGroups(groupId: number, groups: GroupI[]): number[] {
    const hierarchy: number[] = [];
    console.log(groupId);

    let currentGroup = groups.find(g => g.id === groupId);

    while (currentGroup) {
      console.log(currentGroup.id);
      hierarchy.push(currentGroup.id);
      currentGroup = groups.find(g => g.id === currentGroup.parentId);
    }
    return hierarchy;
  }
  // async loadUsers() {
  //   this.users = await this.usersListService.getUsers();
  // }

  goViewRequests(req: RequestI){
    this.reqViewService.selectClient(req)
    this.router.navigate(['/view-excuse']);
  }
}
