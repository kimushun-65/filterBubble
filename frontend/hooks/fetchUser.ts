import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { User } from "@/types/user";

export const fetchUser = async (): Promise<User[]> => {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  const users = usersSnapshot.docs.map((doc) => doc.data() as User);
  return users;
};
