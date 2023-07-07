const localedUser = localStorage.getItem("user")

if (!localedUser) {
    location.assign("/auth/")
}