// Contoh penggunaan:

import { computed } from "./utils/ComputedValue";
import { signal, batchUpdate } from "./utils/Signal";
import { effect } from "./utils/Effect";
import { ObservableValue } from "./utils/ObservableValue";

(async () => {
  // Contoh di vanilla JavaScript
  const firstName = new ObservableValue("John");
  const lastName = new ObservableValue("Doe");

  // Menggunakan computed sebagai input untuk signal
  const fullName = signal(
    computed([firstName, lastName], (first, last) => `${first} ${last}`)
  );

  // Menggunakan effect untuk mengamati perubahan fullName
  effect(() => {
    console.log("fullName berubah:", fullName.value);
  }, [fullName]);

  // Update multiple state dalam satu batch
  batchUpdate(() => {
    firstName.value = "Jane";
    lastName.value = "Smith";
  }); // Hanya 1 render untuk fullName

  // Tunggu sebentar untuk melihat output
  await new Promise((resolve) => setTimeout(resolve, 1000));
})();

// Contoh di React dengan optimasi menggunakan computed
// function UserProfile() {
//   // Menggunakan ObservableValue biasa untuk data dasar
//   const firstName = new ObservableValue("John");
//   const lastName = new ObservableValue("Doe");

//   // Menggunakan computed sebagai signal untuk React
//   const fullName = computed(
//     [firstName, lastName],
//     (first, last) => `${first} ${last}`
//   );

//   // Hanya menggunakan signal untuk computed value
//   const [name, setName] = React.useState(fullName.value);

//   // Effect hanya subscribe ke computed value
//   React.useEffect(() => {
//     const unsubscribe = fullName.subscribe((newName) => {
//       setName(newName);
//     });
//     return unsubscribe;
//   }, [fullName]);

//   const updateName = () => {
//     batchUpdate(() => {
//       firstName.value = "Jane";
//       lastName.value = "Smith";
//     });
//   };

//   return (
//     <div>
//       <p>First Name: {firstName.value}</p>
//       <p>Last Name: {lastName.value}</p>
//       <p>Full Name: {name}</p>
//       <button onClick={updateName}>Update Name</button>
//     </div>
//   );
// }
