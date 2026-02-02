import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

export function subscribeToBlogPosts(callback) {
  const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

export function createBlogPost({ title, content, tags, authorId, authorName }) {
  return addDoc(collection(db, "blogPosts"), {
    title,
    content,
    tags,
    authorId,
    authorName,
    createdAt: serverTimestamp(),
  });
}
