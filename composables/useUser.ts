export default async function (): Promise<Ref<User>> {
  const user = useState<User>("user");

  if (!user.value) {
    const resp = await useAPI("/api/user");
    user.value = resp as any;
  }

  return user;
}
