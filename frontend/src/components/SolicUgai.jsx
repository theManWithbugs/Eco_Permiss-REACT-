import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SolicUgai() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [ugai, setUgai] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

  }

  // useEffect(() => {

  // }, []);

  return (
    <>
    </>
  );
}

export default SolicUgai;