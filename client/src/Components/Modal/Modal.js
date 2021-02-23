import { React, useState, cloneElement } from "react";
import propTypes from "prop-types";
import {
  Modal as RimbleModal,
  Card,
  Box,
  Heading,
  Flex,
  Text,
  Button
} from "rimble-ui";

const Modal = ({ children, trigger, style, onCloseTrigger, show }) => {
  const [shown, toggleShown] = useState(show);

  const renderTrigger = () => {
    return cloneElement(trigger, {
      onClick: () => {
        toggleShown(true);
      }
    });
  };

  const closeModal = e => {
    e.preventDefault();
    toggleShown(false);
    onCloseTrigger();
  };

  return (
    <>
      {trigger && renderTrigger()}
      <RimbleModal isOpen={shown}>
        <Card
          minWidth={"450px"}
          p={"25px"}
          style={{
            maxHeight: "80%",
            overflowY: "auto",
            overflowX: "hidden",
            ...style
          }}
        >
          <Button.Text
            icononly
            icon={"Close"}
            color={"moon-gray"}
            position={"absolute"}
            top={0}
            right={0}
            mt={3}
            mr={3}
            onClick={closeModal}
          />
          {typeof children === "function"
            ? children(closeModal)
            : cloneElement(children, { closeModal })}
        </Card>
      </RimbleModal>
    </>
  );
};

Modal.propTypes = {
  children: propTypes.oneOfType([
    propTypes.element,
    propTypes.array,
    propTypes.object,
    propTypes.func
  ]).isRequired,
  trigger: propTypes.oneOfType([propTypes.element, propTypes.bool]),
  show: propTypes.bool,
  style: propTypes.object,
  onCloseTrigger: propTypes.func,
};

Modal.defaultProps = {
  trigger: false,
  style: {},
  show: false,
  onCloseTrigger: () => {},
};


export default Modal;