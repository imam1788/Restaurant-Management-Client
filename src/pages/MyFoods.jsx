import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

const MyFoods = () => {
  const { user } = useContext(AuthContext);
  const [myFoods, setMyFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/my-foods?email=${user.email}`)
      .then(res => res.json())
      .then(data => {
        setMyFoods(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);


  if (loading) return <p>Loading your foods...</p>;
  if (!myFoods.length) return <p>No foods added yet.</p>;

  return (
    <div className='pb-10 px-4'>
      <div className="mb-8 text-center bg-green-100 py-6 rounded shadow">
        <h1 className="text-4xl font-bold text-green-700">My Foods</h1>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {myFoods.map(food => (
          <div key={food._id} style={{
            border: '1px solid #ccc', borderRadius: '8px', padding: '10px', width: '300px'
          }}>
            <img src={food.foodImage} alt={food.foodName} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <h3 className='font-bold mt-1.5'>{food.foodName}</h3>
            <p>Category: {food.foodCategory}</p>
            <p className='font-bold'>Price: <span className='text-green-700'>${food.price}</span></p>
            <p>Quantity: {food.quantity}</p>
            <div className='text-center'>
              <button className='btn btn-success mt-3.5'>Update</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFoods;
