export const getCloudinaryUrl = (
    publicId,
    transformation = "w_800,c_scale,f_auto,q_auto",
    resourceType = "image",
    version = "v1675432100"
  ) => {
    const cloudName = "da84etlav";
    return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${version}/${transformation}/${publicId}`;
  };
  
  export default getCloudinaryUrl;  