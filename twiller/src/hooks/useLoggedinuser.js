// import React, { useEffect, useState } from "react";
// import { useUserAuth } from "../context/UserAuthContext";
// const useLoggedinuser = () => {
//   const { user } = useUserAuth();
//   const email = user?.email;
//   const [loggedinuser, setloggedinuser] = useState({});

//   useEffect(() => {
//     fetch(`http://localhost:5000/loggedinuser?email=${email}`)
//       .then((res) => res.json())
//       .then((data) => {
//         // console.log(data)
//         setloggedinuser(data);
//       });
//   }, [email, loggedinuser]);
//   return [loggedinuser, setloggedinuser];
// };

// export default useLoggedinuser;
import { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const useLoggedinuser = () => {
  const { user } = useUserAuth();
  const email = user?.email;
  const [loggedinuser, setloggedinuser] = useState({});

  useEffect(() => {
    if (email) {
      fetch(`http://localhost:5000/loggedinuser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setloggedinuser(data[0]);
          } else {
            setloggedinuser({});
          }
        });
    }
  }, [email]);

  return [loggedinuser];
};

export default useLoggedinuser;
