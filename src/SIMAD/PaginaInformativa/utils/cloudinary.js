export const getCloudinaryUrl = (
    publicId,
    transformation = "w_800,c_scale",
    resourceType = "image"
  ) => {
    const cloudName = "da84etlav";
    // Retorna la URL de Cloudinary usando el resourceType (image o video)
    return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformation}/${publicId}`;
  };
  
  export default getCloudinaryUrl;
  