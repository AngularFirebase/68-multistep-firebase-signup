import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NotifyService } from './notify.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

interface User {
  uid: string;
  email: string;
  photoURL: string;
  catchPhrase?: string;
}


@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router,
              private notify: NotifyService) {

      this.user = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
          } else {
            return Observable.of(null)
          }
        })

  }

  //// Email/Password Auth ////
  
  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.setUserDoc(user) // create initial user document
      })
      .catch(error => this.handleError(error) );
  }

  // Update properties on the user document
  updateUser(user: User, data: any) { 
    return this.afs.doc(`users/${user.uid}`).update(data)
  }



  // If error, console log and notify user
  private handleError(error) {
    console.error(error)
    this.notify.update(error.message, 'error')
  }

  // Sets user data to firestore after succesful login
  private setUserDoc(user) {

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      photoURL: 'https://goo.gl/Fz9nrQ'
    }

    return userRef.set(data)

  }




  /// Additional useful methods, not used in video

  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch(error => this.handleError(error) );
  }
  
  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth.sendPasswordResetEmail(email)
      .then(() => this.notify.update('Password update email sent', 'info'))
      .catch((error) => this.handleError(error) )
  }


  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/']);
    });
  }
  








































    ////// OAuth Methods /////


    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider()
      return this.oAuthLogin(provider);
    }
  
    githubLogin() {
      const provider = new firebase.auth.GithubAuthProvider()
      return this.oAuthLogin(provider);
    }
  
    facebookLogin() {
      const provider = new firebase.auth.FacebookAuthProvider()
      return this.oAuthLogin(provider);
    }
  
    twitterLogin() {
      const provider = new firebase.auth.TwitterAuthProvider()
      return this.oAuthLogin(provider);
    }
  
  
    private oAuthLogin(provider) {
      return this.afAuth.auth.signInWithPopup(provider)
        .then((credential) => {
          this.notify.update('Welcome to Firestarter!!!', 'success')
          return this.setUserDoc(credential.user)
        })
        .catch(error => this.handleError(error) );
    }
  
  
    //// Anonymous Auth ////
  
    anonymousLogin() {
      return this.afAuth.auth.signInAnonymously()
        .then((user) => {
          this.notify.update('Welcome to Firestarter!!!', 'success')
          return this.setUserDoc(user) // if using firestore
        })
        .catch(error => this.handleError(error) );
    }
    

}
