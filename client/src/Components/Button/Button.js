import { Button as RimbleButton, Loader } from "rimble-ui";

const Button = ({ children, loading, loadingLabel, ...restOfProps }) => {
  const ButtonChildrenWithLoader = () =>
    loading ? (
      <>
        {loadingLabel || null}
        <Loader color="white" ml={loadingLabel && 1} />
      </>
    ) : (
      children
    );

  return (
    <RimbleButton {...restOfProps}>
      <ButtonChildrenWithLoader />
    </RimbleButton>
  );
};

export default Button;
