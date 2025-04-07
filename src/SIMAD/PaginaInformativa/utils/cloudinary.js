export const getCloudinaryUrl = (
    publicId,
    transformation = "w_800,c_scale,f_auto,q_auto",
    resourceType = "image",
  ) => {
    const cloudName = "da84etlav";
    return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformation}/${publicId}`;
  };
  
  export default getCloudinaryUrl;  