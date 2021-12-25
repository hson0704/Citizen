import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import Error from "../shared/Error";

const Stat = () => {
  const navigate = useNavigate();
  const fields = {
    cccd: "CMT/CCCD",
    ngaySinh: "Ngày Sinh",
    gioiTinh: "Giới tính",
    thuongTru: "Địa chỉ",
  };
  const auth = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const request = async () => {
      document.title = "Citizen - Thông tin";
      await fetch("http://localhost:8000/api/list", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + auth.info().access_token,
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setData(data);
        })
        .catch((error) => console.log(error));
    };
    request();
  }, [auth]);

  return data.length ? (
    <div className="container">
      <div className="d-flex justify-content-between">
        <h2 className="my-4 gi">Thông tin người dân</h2>
        <SortSelector
          className="w-auto align-self-end"
          data={data}
          setData={(data) => {
            setData(data);
          }}
        />
      </div>
      <StatTable
        fields={fields}
        data={data}
        navigate={(url) => {
          navigate(url);
        }}
      />
      <p className="text-muted my-4">
        (Bấm vào hàng của bảng để xem thông tin chi tiết).
      </p>
    </div>
  ) : (
    <Error status="nothing" />
  );
};

const SortSelector = ({ className, data, setData }) => {
  const [value, setValue] = useState("0");
  const oldData = data;

  const handleChange = (event) => {
    const key = event.target.value;
    setValue(key);
    if (key === "0") {
      data = oldData;
    } else {
      switch (key) {
        case "fullName":
          console.log(key);
          for (let i = 0; i < data.length; i++) {
            for (let j = i + 1; j < data.length; j++) {
              if (data[i].ho > data[j].ho) {
                console.log("haoaa");
                const temp = data[i];
                data[i] = data[j];
                data[j] = temp;
                setData(data);
              }
            }
          }
          break;
        case "age":
          break;
        case "address":
          break;
      }
    }
  };
  return (
    <div className="d-flex">
      <span className="my-auto me-2">Sắp xếp theo:</span>
      <select
        className={className + " form-select p-2 pe-5 my-auto"}
        value={value}
        onChange={handleChange}
      >
        <option value="0">Mặc định</option>
        <option value="fullName">Tên</option>
        <option value="age">Tuổi</option>
        <option value="address">Địa chỉ</option>
      </select>
    </div>
  );
};

const StatTable = ({ data, fields, navigate }) => {
  const need = Object.keys(fields);
  let heads = [];
  heads.push(
    <th key="stt" scope="col">
      STT
    </th>
  );
  heads.push(
    <th key="fullName" scope="col">
      Họ và tên
    </th>
  );
  let rows = [];
  for (let key in data[0]) {
    need.includes(key) &&
      heads.push(
        <th key={key} scope="col">
          {fields[key]}
        </th>
      );
  }

  for (const key in data) {
    let cells = [];
    cells.push(<td key="stt">{rows.length + 1}</td>);
    cells.push(
      <td key="fullName">{data[key].ho.concat(" ", data[key].ten)}</td>
    );
    for (const a in data[key]) {
      need.includes(a) && cells.push(<td key={a}>{data[key][a]}</td>);
    }
    rows.push(
      <tr
        key={key}
        onClick={() => {
          navigate("/statistic/" + data[key].ID);
        }}
      >
        {cells}
      </tr>
    );
  }

  return (
    <table className="stat table table-light table-bordered table-striped">
      <thead>
        <tr>{heads}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default Stat;
