<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title>{{ userName }}
                        <v-icon v-if="userRole === 'Admin'" color="blue">mdi-check-decagram</v-icon>
                        <v-icon v-else-if="userRole === 'Moderator'" color="teal">mdi-check-circle</v-icon>
                        <v-icon v-else-if="userRole === 'Punished'" color="red">mdi-lock</v-icon>
                        さん、ようこそ
                    </v-card-title>
                    <v-card-text>
                        <v-btn @click="logout" color="primary" class="rounded-pill mx-2">ログアウト</v-btn>
                        <v-btn :to="`/firebase/channel/${userId}`" color="primary"
                            class="rounded-pill mx-2">プロフィール</v-btn>
                    </v-card-text>
                    <v-card-title>タイムライン</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="postContent" label="New Post" outlined auto-grow rows="1"></v-textarea>
                        <div>
                            <v-chip v-for="tag in selectedTags" :key="tag" class="ma-2" outlined>{{ tag }}</v-chip>
                        </div>
                        <v-btn @click="submitPost" class="rounded-pill mx-2" color="primary">投稿</v-btn>
                        <v-btn @click="openTagDialog" class="rounded-pill mx-2" color="primary">タグを追加</v-btn>
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

        <v-dialog v-model="tagDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    タグを選択
                </v-card-title>
                <v-card-text>
                    <v-checkbox v-for="tag in availableTags" :key="tag" :label="tag" :value="tag"
                        v-model="selectedTags"></v-checkbox>
                    <v-text-field v-model="newTag" label="カスタムタグを追加" @keyup.enter="addCustomTag"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="tagDialog = false">閉じる</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, getFirestore, serverTimestamp, query, onSnapshot, deleteDoc, doc, orderBy, getDoc, updateDoc, arrayUnion, arrayRemove, where } from 'firebase/firestore';
import auth from '~/plugins/firebase';

const db = getFirestore();
const router = useRouter();
const userName = ref<string>('User');
const userRole = ref<string>('User');
const userId = ref<string>('');
const postContent = ref<string>('');
const tagDialog = ref<boolean>(false);
const errorMessage = ref('');
const dialog = ref(false);
const selectedTags = ref<Array<string>>([]);
const availableTags = ref<Array<string>>(['タイムラインに載せない', '雑談', 'ニュース', 'Links']);
const newTag = ref<string>('');

const posts = ref<Array<any>>([]);

onAuthStateChanged(auth, async (user) => {
    if (user && user.emailVerified) {
        userId.value = user.uid;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            userName.value = userData.displayName || 'User';
            userRole.value = userData.role || 'User';
        } else {
            userName.value = 'User';
            userRole.value = 'User';
        }
    } else {
        router.push('/firebase/login');
    }
});

const logout = async () => {
    try {
        await signOut(auth);
        router.push('/firebase/login');
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

const openTagDialog = () => {
    tagDialog.value = true;
};

const addCustomTag = () => {
    if (newTag.value.trim() !== '' && !availableTags.value.includes(newTag.value)) {
        availableTags.value.push(newTag.value);
        selectedTags.value.push(newTag.value);
        newTag.value = '';
    }
};

const submitPost = async () => {
    if (userRole.value === 'Punished') {
        errorMessage.value = '投稿する権限がありません';
        dialog.value = true;
        return;
    }

    if (postContent.value.trim() === '') {
        errorMessage.value = '投稿内容が空です';
        dialog.value = true;
        return;
    }

    try {
        await addDoc(collection(db, 'posts'), {
            authorId: auth.currentUser?.uid || 'User',
            likes: [],
            text: postContent.value,
            tags: selectedTags.value,
            isTimeLine: !selectedTags.value.includes('タイムラインに載せない'),
            timestamp: serverTimestamp()
        });
        postContent.value = '';
    } catch (error) {
        console.error('Error adding document: ', error);
        errorMessage.value = '投稿に失敗しました';
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

const fetchPosts = async () => {
    const q = query(
        collection(db, 'posts'),
        where('isTimeLine', '==', true),
        orderBy('timestamp', 'desc')
    ); onSnapshot(q, async (querySnapshot) => {
        const postsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const { displayName, role } = await fetchDisplayName(data.authorId);
            return { id: doc.id, displayName, role, ...data };
        }));
        posts.value = postsData;
    });
};


onSnapshot(collection(db, 'users'), (snapshot) => {
    fetchPosts();
    snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified' && change.doc.id === auth.currentUser?.uid) {
            userName.value = change.doc.data().displayName || 'User';
        }
    });
});


await fetchPosts();
</script>