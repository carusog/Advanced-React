import PropTypes from 'prop-types';

export default function Page({ children, cool }) {
  return (
    <div>
      <h1>I am the page component</h1>
      <h2>{cool}</h2>
      {children}
    </div>
  );
}

Page.propTypes = {
  cool: PropTypes.string,
  children: PropTypes.any,
};
