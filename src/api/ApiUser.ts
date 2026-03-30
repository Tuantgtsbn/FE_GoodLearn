import type { IUser } from "@/types"
import { fetcher } from "./Fetcher"

const path = {
    updateProfile: '/users/me',
}

const updateProfile = (data: Partial<IUser> & { avatar?: File }) => {
    return fetcher<IUser>({
        url: path.updateProfile,
        method: 'PATCH',
        data,
    }, {
        isFormData: true
    })
}

export default {
    updateProfile,
}