import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";


const Container = styled.div`
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000; /* 필요에 따라 다른 요소 위에 표시되도록 z-index를 설정 */
`;

const GotoTop = styled.div`
  opacity: ${(props) => props.opacity};
  cursor: pointer;
`;

const GotoDown = styled.div`
  opacity: ${(props) => props.opacity};
  cursor: pointer;
`;

const img = styled.img`
  width: 2px;
  height: 2px;
`;

function MoveButton({ opacity }) {
  const MoveToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const MoveToDown = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
  }

  return (
    <Container>
      <GotoTop opacity={opacity} onClick={MoveToTop}>
      <BiUpArrow size={24} className='text-yellow-600' />
      </GotoTop>
      <GotoDown opacity={opacity} onClick={MoveToDown}>
        <BiDownArrow size={24} className='text-yellow-600' />
      </GotoDown>

    </Container>
  );
}

MoveButton.propTypes = {
  opacity: PropTypes.number.isRequired,
};

export default MoveButton;