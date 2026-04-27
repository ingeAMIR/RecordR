import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { MatchesComponent } from './components/matches/matches';
import { MatchDetailComponent } from './components/match-detail/match-detail';
import { PlayersComponent } from './components/players/players';
import { ListsComponent } from './components/lists/lists';
import { ProfileComponent } from './components/profile/profile';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'matches', component: MatchesComponent },
    { path: 'match/:id', component: MatchDetailComponent },
    { path: 'players', component: PlayersComponent },
    { path: 'lists', component: ListsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: '**', redirectTo: '' }
];
