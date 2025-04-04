<template>
  <v-container v-if="isServiceWorkerRegistered">
    <v-form @submit.prevent="login">
      <v-text-field v-model="email" label="Email" required />
      <v-text-field
        v-model="password" :type="showPassword ? 'text' : 'password'" label="Password" required
        append-icon="mdi-eye" @click:append="togglePasswordVisibility" />
      <v-btn type="submit" color="primary" class="rounded-pill mx-2">ログイン</v-btn>
      <v-btn color="warning" class="rounded-pill mx-2" @click="openResetDialog">パスワードを忘れた場合</v-btn>
    </v-form>
    <v-form class="mt-4" @submit.prevent="register">
      <v-text-field v-model="newEmail" label="New Email" required />
      <v-text-field
        v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" label="New Password"
        required append-icon="mdi-eye" @click:append="toggleNewPasswordVisibility" />
      <v-text-field
        v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
        label="Confirm Password" required append-icon="mdi-eye"
        @click:append="toggleConfirmPasswordVisibility" />
      <v-btn type="submit" color="secondary">新規登録</v-btn>
    </v-form>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">メッセージ</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialog = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="resetDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">パスワードをリセット</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="sendPasswordReset">
            <v-text-field v-model="resetEmail" label="Email" required />
            <v-btn type="submit" color="primary">リセットメールを送る</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" @click="resetDialog = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import auth from '~/plugins/firebase';

const email = ref('');
const password = ref('');
const newEmail = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const resetEmail = ref('');
const dialog = ref(false);
const resetDialog = ref(false);
const errorMessage = ref('');
const router = useRouter();
const isServiceWorkerRegistered = ref(false);

useHead({
  title: 'Login - JPTube Firebase',
});

definePageMeta({
  layout: 'firebase',
});

const showPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

onAuthStateChanged(auth, async (user) => {
  if (user && user.emailVerified) {
    router.push('/firebase/');
  }
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    if (!user.emailVerified) {
      await sendEmailVerification(user);
      errorMessage.value = 'Emailが認証されていません。認証メールを再送しました。確認してください。';
      dialog.value = true;
      await auth.signOut();
      return;
    }
    router.push('/firebase/');
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
    dialog.value = true;
  }
};

const register = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'パスワードが一致しません';
    dialog.value = true;
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, newEmail.value, newPassword.value);
    const user = userCredential.user;
    await sendEmailVerification(user);
    const db = getFirestore();
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
    });
    errorMessage.value = '新規登録が完了しました。メールを確認してください。';
    dialog.value = true;
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
    dialog.value = true;
  }
};

const openResetDialog = () => {
  resetDialog.value = true;
};

const sendPasswordReset = async () => {
  try {
    await sendPasswordResetEmail(auth, resetEmail.value);
    errorMessage.value = 'パスワードリセットメールを送信しました';
    dialog.value = true;
    resetDialog.value = false;
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
    dialog.value = true;
  }
};

onMounted(() => {
  isServiceWorkerRegistered.value = true;

  /* if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/firebase' }).then(() => {
      isServiceWorkerRegistered.value = true;
    }).catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
  } */
});
</script>
