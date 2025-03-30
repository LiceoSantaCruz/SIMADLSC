import PropTypes from 'prop-types';
import getCloudinaryUrl from '../PaginaInformativa/utils/cloudinary';

const ResponsiveCardImage = ({ publicId, altText }) => {
  return (
    <div className="relative h-40 md:h-44 lg:h-48">
      <picture className="absolute inset-0 w-full h-full">
        {/* Para pantallas pequeñas */}
        <source
          media="(max-width: 768px)"
          srcSet={`
            ${getCloudinaryUrl(publicId, "w_400,c_scale")} 1x,
            ${getCloudinaryUrl(publicId, "w_800,c_scale")} 2x
          `}
        />
        {/* Para pantallas medianas y grandes */}
        <source
          media="(min-width: 769px)"
          srcSet={`
            ${getCloudinaryUrl(publicId, "w_800,c_scale")} 1x,
            ${getCloudinaryUrl(publicId, "w_1200,c_scale")} 2x
          `}
        />
        <img
          src={getCloudinaryUrl(publicId, "w_800,c_scale")}
          alt={altText}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 rounded-t-lg"></div>
    </div>
  );
};

ResponsiveCardImage.propTypes = {
  publicId: PropTypes.string.isRequired,
  altText: PropTypes.string,
};

ResponsiveCardImage.defaultProps = {
  altText: "Imagen de evento",
};

export default ResponsiveCardImage;
