import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridToolbarQuickFilter,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import supabase from "@/comporment config/supabase";
import * as XLSX from "xlsx";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from "next/router";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function CustomToolbar() {
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          pb: 0,
          justifyContent: "center",
          bgcolor: "#f8f3f4e8",
          borderRadius: 1,
          height: 60,
        }}
      >
        {" "}
        <GridToolbarContainer>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          {/* <GridToolbarExport /> */}
        </GridToolbarContainer>
        <GridToolbarQuickFilter
          sx={{ mt: 2 }}
          quickFilterParser={(searchInput: string) =>
            searchInput
              .split(",")
              .map((value) => value.trim())
              .filter((value) => value !== "")
          }
        ></GridToolbarQuickFilter>
      </Box>
    </div>
  );
}

const columns: GridColDef[] = [
  //   { field: "id", headerName: "ID", width: 90 },
  {
    field: "PD_key",
    headerClassName: "super-app-theme--header",
    headerName: "PD key",
    width: 120,
    editable: true,
  },
  {
    field: "Work_order_id",
    headerClassName: "super-app-theme--header",
    headerName: "Work order id",
    width: 120,
    editable: true,
  },
  {
    field: "Item_number",
    headerClassName: "super-app-theme--header",
    headerName: "Item number",
    width: 150,
    editable: true,
  },
  {
    field: "Production_date",
    headerClassName: "super-app-theme--header",
    headerName: "Production date",
    width: 120,
  },
  {
    field: "Production_unit",
    headerClassName: "super-app-theme--header",
    headerName: "Production unit",
    width: 120,
  },
  {
    field: "NG_qty",
    headerClassName: "super-app-theme--header",
    headerName: "NG qty",
    width: 120,
  },
  {
    field: "Part_name",
    headerClassName: "super-app-theme--header",
    headerName: "Part name",
    width: 150,
  },
  {
    field: "NG_code",
    headerClassName: "super-app-theme--header",
    headerName: "NG code",
    width: 120,
  },

  {
    field: "NG_description_th",
    headerClassName: "super-app-theme--header",
    headerName: "NG description th",
    width: 250,
  },
  {
    field: "NG_description_cn",
    headerClassName: "super-app-theme--header",
    headerName: "NG description cn",
    width: 250,
  },
  {
    field: "NG_description_en",
    headerClassName: "super-app-theme--header",
    headerName: "NG_description_en",
    width: 300,
  },
  {
    field: "NG_description_vn",
    headerClassName: "super-app-theme--header",
    headerName: "NG_description_vn",
    width: 300,
  },
];

export default function Homes() {
  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  const [valueShift, setValueShift] = useState<any>("All");
  console.log("valueShift", valueShift);
  const router = useRouter();
  //   useEffect(() => {
  //     const fetchCheckID = async () => {
  //       let { data: userID, error } = await supabase
  //         .from("userID")
  //         .select("emp_no")
  //         .eq("emp_no", localStorage.getItem("emp_no"));
  //       if (userID?.length != 0) {
  //         console.log("Check ID OK :D");
  //       } else {
  //         router.push("www.google.com");
  //       }
  //     };
  //     fetchCheckID();
  //   }, []);
  //testttt
  const currentDate = `${year}-${month}-${day}`;
  const [dataShow, setDataShow] = useState<any>([]);
  // console.log("dataShow", dataShow);

  const [valueStart, setValueStart] = useState<Dayjs | null>(
    dayjs(currentDate)
  );
  const [valueEnd, setValueEnd] = useState<Dayjs | null>(dayjs(currentDate));
  //   console.log("valueEnd", dayjs(valueEnd).format("YYYY-MM-DD"));

  useEffect(() => {
    const fetchdataALL = async () => {
      let { data: Downtime_record, error } = await supabase
        .from("NG_record")
        .select(
          "id,PD_key,Work_order_id,Item_number,Production_date,Production_unit,NG_qty,Part_name,NG_code,NG_description_th,NG_description_cn,NG_description_en,NG_description_vn"
        )
        .gte("Production_date", dayjs(valueStart).format())
        .lte("Production_date", dayjs(valueEnd).format())
        .order("id", { ascending: true });
      if (!error) {
        console.log("fetch Success :D", Downtime_record);
        setDataShow(Downtime_record);
      } else {
        console.log("fetch Error !!!");
      }
    };
    fetchdataALL();
  }, [valueStart, valueEnd]);

  const handleOnExport = () => {
    let wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataShow);
    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    XLSX.writeFile(wb, "NG_record.xlsx");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, m: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Typography
              variant="h2"
              gutterBottom
              align="center"
              fontFamily={"Sans-serif"}
              fontStyle={"italic"}
            >
              TIT Export file Production NG Record
            </Typography>
          </Grid>
          <Grid item xs={6} lg={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "100%" }}
                label="Start"
                value={valueStart}
                onChange={(newValue) => setValueStart(newValue)}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} lg={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={{ width: "100%" }}
                label="End"
                value={valueEnd}
                onChange={(newValue) => setValueEnd(newValue)}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} lg={2}>
            <Button
              variant="contained"
              onClick={handleOnExport}
              color="success"
              sx={{ width: "100%", height: 55 }}
            >
              Export Excel
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          p: 2,
          height: 650,
          width: "100%",
          display: "flow",
          "& .super-app-theme--header": {
            backgroundColor: "#ffa000",
          },
        }}
      >
        <DataGrid
          rows={dataShow}
          columns={columns}
          components={{ Toolbar: CustomToolbar }}
          getRowId={(row: any) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          pageSizeOptions={[100]}
          //   checkboxSelection
          //   disableRowSelectionOnClick
        />
      </Box>
    </>
  );
}
