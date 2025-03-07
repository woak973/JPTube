<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card v-if="user">
                    <v-card-title>
                        {{ user.displayName || 'User' }}
                        <v-btn v-if="isCurrentUser" @click="showEditDialog" color="primary"
                            class="rounded-pill mx-2">編集</v-btn>
                    </v-card-title>
                    <v-card-text>{{ user.description }}
                    </v-card-text>
                    <v-card-subtitle>
                        <p>作成日時: {{ user.createdAt ? user.createdAt.toDate().toLocaleString() : 'N/A' }}</p>
                        <p>投稿数: {{ posts.length }}</p>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-btn :to="'/firebase/'" color="primary" class="rounded-pill mx-2">タイムラインを見る</v-btn>
                    </v-card-text>
                </v-card>
                <FirebasePostCard :posts="posts" @like-post="likePost" @delete-post="deletePost" />
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-title class="headline">メッセージ</v-card-title>
                <v-card-text>{{ errorMessage }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="dialog = false">閉じる</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="isEditDialogVisible" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">編集</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="editForm">
                        <v-text-field v-model="NewUserName" label="新しい名前" required></v-text-field>
                        <v-textarea v-model="NewUserDescription" label="新しい説明" required></v-textarea>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" @click="closeEditDialog">キャンセル</v-btn>
                    <v-btn color="blue darken-1" @click="updateUserProfile">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, collection, query, orderBy, deleteDoc, updateDoc, getDoc, arrayRemove, arrayUnion, where } from 'firebase/firestore';
import auth from '~/plugins/firebase';

const route = useRoute();
const router = useRouter();
const user = ref();
const errorMessage = ref('');
const dialog = ref(false);
const isCurrentUser = ref(false);
const isEditDialogVisible = ref(false);
const NewUserName = ref('');
const NewUserDescription = ref('');
const posts = ref<Array<any>>([]);

const db = getFirestore();
const userId = route.params.id as string;
const userDocRef = doc(db, 'users', userId);

onAuthStateChanged(auth, async (user) => {
    if (!user || !user.emailVerified) {
        router.push('/firebase/login');
    }
});

onSnapshot(userDocRef, (userDoc) => {
    if (userDoc.exists()) {
        user.value = userDoc.data();
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === userId) {
            isCurrentUser.value = true;
        }
    } else {
        user.value = null;
    }
});

const fetchPosts = async () => {
    const q = query(
        collection(db, 'posts'),
        where('authorId', '==', userId),
        orderBy('timestamp', 'desc')
    );
    onSnapshot(q, async (querySnapshot) => {
        const postsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const { displayName, role } = await fetchDisplayName(data.authorId);
            return { id: doc.id, displayName, role, ...data };
        }));
        posts.value = postsData;
    });
};

const showEditDialog = () => {
    NewUserName.value = user.value?.displayName || '';
    NewUserDescription.value = user.value?.description || '';
    isEditDialogVisible.value = true;
};

const closeEditDialog = () => {
    isEditDialogVisible.value = false;
};

const fetchDisplayName = async (authorId: string) => {
    const userDoc = await getDoc(doc(db, 'users', authorId));
    if (userDoc.exists()) {
        const data = userDoc.data();
        return {
            displayName: data.displayName || 'User',
            role: data.role || 'User'
        };
    } else {
        return {
            displayName: 'User',
            role: 'User'
        };
    }
};

const updateUserProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                displayName: NewUserName.value,
                description: NewUserDescription.value
            }, { merge: true });
            errorMessage.value = "ユーザプロフィールが更新されました";
            dialog.value = true;
            closeEditDialog();
        } catch (error) {
            console.error('ユーザプロフィールの更新に失敗しました:', error);
            errorMessage.value = "ユーザプロフィールの更新に失敗しました";
            dialog.value = true;
        }
    } else {
        errorMessage.value = "ユーザがログインしていません";
        dialog.value = true;
    }
};

const deletePost = async (postId: string) => {
    try {
        await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
        console.error('Error deleting document: ', error);
        errorMessage.value = '投稿の削除に失敗しました';
        dialog.value = true;
    }
};

const likePost = async (postId: string) => {
    try {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
            const likes = postDoc.data().likes || [];
            const userId = auth.currentUser?.uid;
            if (userId) {
                if (likes.includes(userId)) {
                    await updateDoc(postRef, { likes: arrayRemove(userId) });
                } else {
                    await updateDoc(postRef, { likes: arrayUnion(userId) });
                }
            }
        }
    } catch (error) {
        console.error('Error liking post: ', error);
        errorMessage.value = '投稿のいいねに失敗しました';
        dialog.value = true;
    }
};

await fetchPosts();
</script>