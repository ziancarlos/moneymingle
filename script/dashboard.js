const url = "http://localhost:9000";

const userId = localStorage.getItem("userId");

if (userId !== null) {
  fetch(`${url}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        // Handle a successful response
        return response.json();
      } else if (response.status === 400) {
        // Handle a bad request (status code 400)
        window.location.href = "logout.html";

        alert("Session telah berakhir!");

        throw new Error("Bad request");
      } else if (response.status === 401 || response.status === 403) {
        // Unauthorized or Forbidden, redirect to login

        window.location.href = "logout.html";

        alert("Session expired or unauthorized access!");
      } else {
        // Handle other status codes as needed

        window.location.href = "logout.html";

        alert("Call admin!");

        throw new Error("Unexpected response");
      }
    })
    .then((data) => {})
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
    });
} else {
  // The item with the key "userId" is not present in localStorage
  alert("Session is ended!");
  // Redirect to login page if user ID is not present
  window.location.href = "login.html";
}

// Function to fetch and render data
const fetchDataAndRenderTable = () => {
  fetch(`${url}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: localStorage.getItem("userId"),
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (
        response.status === 400 ||
        response.status === 401 ||
        response.status === 403
      ) {
        // Handle unauthorized or bad request
        window.location.href = "logout.html";
        alert("Session expired or unauthorized access!");
        throw new Error("Unauthorized or Bad Request");
      } else {
        // Handle other status codes
        window.location.href = "logout.html";
        alert("Call admin!");
        throw new Error("Unexpected response");
      }
    })
    .then((data) => {
      console.log(data);

      // Assuming tbody is the ID of your table body
      const tbody = document.getElementById("data-keuangan");

      // Clear existing rows
      tbody.innerHTML = "";

      // Initialize totals
      let totalPemasukan = 0;
      let totalPengeluaran = 0;

      // Loop through the data and append to the table
      data.data.forEach((transaction, index) => {
        const row = document.createElement("tr");

        // Display row number in the first column
        const numberCell = document.createElement("td");
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);

        // Display other columns
        const columns = ["id", "name", "type", "amount", "description"];
        columns.forEach((column) => {
          const cell = document.createElement("td");

          // Format the "amount" column as Rupiah
          if (column === "amount") {
            cell.textContent = formatRupiah(
              transaction[column].toString(),
              "Rp. "
            );
          } else if (column === "type") {
            // Display "Debit" for type 1 and "Credit" for type 0
            cell.textContent = transaction[column] === 1 ? "Debit" : "Credit";
          } else {
            cell.textContent = transaction[column];
          }

          row.appendChild(cell);
        });

        // Update totals based on the type and amount of the transaction
        if (transaction.type === 1) {
          // Type 1 is Pemasukan (income)
          totalPemasukan += transaction.amount;
        } else if (transaction.type === 0) {
          // Type 0 is Pengeluaran (expenditure)
          totalPengeluaran += transaction.amount;
        }

        // Button cell
        const buttonCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger";
        deleteButton.textContent = "hapus";
        deleteButton.addEventListener("click", () => {
          console.log(transaction.id);
          // Add logic to handle delete button click, e.g., make another API call to delete the transaction
          deleteTransaction(transaction.id);
        });
        buttonCell.appendChild(deleteButton);
        row.appendChild(buttonCell);

        tbody.appendChild(row);
      });

      // Update the displayed totals
      document.getElementById("total-pemasukan").textContent = formatRupiah(
        totalPemasukan.toString(),
        "Rp. "
      );
      document.getElementById("total-pengeluaran").textContent = formatRupiah(
        totalPengeluaran.toString(),
        "Rp. "
      );
      const saldo = totalPemasukan - totalPengeluaran;
      document.getElementById("saldo").textContent = formatRupiah(
        saldo.toString(),
        "Rp. "
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Function to delete a transaction
const deleteTransaction = (transactionId) => {
  // Make the DELETE request to delete the transaction by ID
  fetch(`${url}/transactions`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transactionId: transactionId,
    }),
  })
    .then((response) => {
      if (response.ok) {
        // If deletion is successful, refresh the table
        fetchDataAndRenderTable();
      } else {
        // Handle other cases
        console.error("Error deleting transaction:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error deleting transaction:", error);
    });
};

// Initial call to fetch and render data
fetchDataAndRenderTable();

/* Fungsi formatRupiah */
/* Fungsi formatRupiah */
function formatRupiah(angka, prefix) {
  // Ensure angka is a string
  if (typeof angka !== "string") {
    return "";
  }

  var number_string = angka.replace(/[^,\d]/g, "").toString(),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
}

var rupiah = document.querySelectorAll(".biayaData");
rupiah.forEach((element) => {
  element.innerHTML = formatRupiah(element.innerHTML, "Rp. ");
});

var rupiah = document.getElementById("jumlahInput");
rupiah.value = formatRupiah(rupiah.value, "Rp. ");

rupiah.addEventListener("keyup", function (e) {
  // tambahkan 'Rp.' pada saat form di ketik
  // gunakan fungsi formatRupiah() untuk mengubah angka yang di ketik menjadi format angka
  rupiah.value = formatRupiah(this.value, "Rp. ");
});

document.getElementById("btn-add").addEventListener("click", function () {
  // Get values from the modal inputs
  const name = document.getElementById("namaInput").value;
  const description = document.getElementById("deskripsiInput").value;
  const formattedAmount = document.getElementById("jumlahInput").value;
  const type = document.getElementById("kategoriInput").value;
  const userId = localStorage.getItem("userId");

  // Extract numeric value from the formatted amount
  const amount = parseInt(formattedAmount.replace(/[^0-9]/g, ""));

  if (!isValidNumericString(amount) || !isValidTypeString(type)) {
    alert("Invalid amount or type");

    // Close the modal
    $("#addModal").modal("hide");

    document.getElementById("namaInput").value = "";
    document.getElementById("deskripsiInput").value = "";
    document.getElementById("jumlahInput").value = "";
    document.getElementById("kategoriInput").value = "0"; // or '1' depending on your default

    return;
  }

  // Create the request payload
  const payload = {
    name: name,
    description: description,
    amount: amount,
    type: parseInt(type),
    userId: userId,
  };

  // Make a PUT request to the /transactions endpoint
  fetch(`${url}/transactions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        // Handle a successful response
        alert("Transaction added successfully");

        // Close the modal
        $("#addModal").modal("hide");

        // Refresh the table (assuming you have a function to refresh the table)

        document.getElementById("namaInput").value = "";
        document.getElementById("deskripsiInput").value = "";
        document.getElementById("jumlahInput").value = "";
        document.getElementById("kategoriInput").value = "0"; // or '1' depending on your default

        fetchDataAndRenderTable();
      } else if (response.status === 404) {
        // User not found
        alert("User does not exist");
      } else {
        // Handle other status codes
        alert("Failed to add transaction");
      }
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
      alert("Error adding transaction");

      document.getElementById("namaInput").value = "";
      document.getElementById("deskripsiInput").value = "";
      document.getElementById("jumlahInput").value = "";
      document.getElementById("kategoriInput").value = "0"; // or '1' depending on your default
    });
});

function isValidNumericString(value) {
  return /^[0-9]+$/.test(value);
}

function isValidTypeString(value) {
  return value === "0" || value === "1";
}
