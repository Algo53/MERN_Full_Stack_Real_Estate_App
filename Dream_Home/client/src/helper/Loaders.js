import apiRequest from "./apiRequest"

export const singlePostLoader = async({request, params}) => {
    const result = await apiRequest("/post/property/" + params.id);
    return result.data;
}