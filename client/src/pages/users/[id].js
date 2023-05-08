// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

import { AiFillCheckCircle, AiOutlinePlus } from "react-icons/ai";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Router from "next/router";
import { useRouter } from "next/router";

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = () => {
  // ** State
  const [openAlert, setOpenAlert] = useState(true)
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
    }
  }




  const router = useRouter();
  const { id } = router.query;
  console.log(router.query);

  const [currentSection, setCurrentSection] = useState("Profile");
  const [companyDetails, setCompanyDetails] = useState();

  useEffect(async () => {
    if (router.isReady) {
      console.log(id);
      await axios({
        method: "get",
        // withCredentials: true,
        url: `http://localhost:4000/get-company/?email=${id}`,
      }).then((data) => {
        setCompanyDetails(data.data);
      });
    }
  }, [router.isReady, id]);




  const message = () => {
    return (
      <div className="flex items-center justify-betwen">
        <div className="text-white">
          {/* <AiFillCheckCircle /> */}
        </div>
        <div className=" ml-2 font-inter text-white text-[14px] ">
          Details saved successfully!
        </div>
      </div>
    );
  };


  const notify = () => {
    toast(message, {
      position: "top-center",
      style: {
        width: "fit-content",
        borderRadius: "9999px",
        fontFamily: "Inter",
        backgroundColor: "black",
      },
    });
    Router.push("/userDashboard/companies");
  };
  const fileRef = useRef(null);

  // const [companyDetails, setCompanyDetails] = useState();
  const [userEmail, setuserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [roles, setRoles] = useState("");
  const [activecheck, setActivecheck] = useState(true);
  // const [companyLogo, setCompanyLogo] = useState("");
  // const [companyTagline, setCompanyTagline] = useState("");
  // const [featured, setFeatured] = useState(false);

  // useEffect(async () => {
  //   if (id) {
  //     await axios({
  //       method: "get",
  //       // withCredentials: true,
  //       url: `https://hirable-backend-original.vercel.app/get-companies/?_id=${id}`,
  //     }).then((data) => {
  //       setCompanyDetails(data.data);
  //       setuserEmail(data.data.title);
  //       setPassword(data.data.password);
  //       setCompanyLogo(data.data.image);
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (companyDetails) {
      setuserEmail(companyDetails.email);
      setPassword(companyDetails.password);
      setFname(companyDetails.fname);
      setLname(companyDetails.lname);
      setRoles(companyDetails.roles);
      setActivecheck(companyDetails.activecheck);
      // setCompanyLogo(companyDetails.image);
      // setCompanyTagline(companyDetails.tagline);
      // setFeatured(companyDetails.featured);
    }
    console.log(companyDetails);
  }, [companyDetails]);

  const [userList, setuserList] = useState([]);

  // useEffect(() => {
  //   axios({
  //     method: "get",
  //     withCredentials: true,
  //     url: "http://localhost:4000/get-companies",
  //   }).then((data) => {
  //     setuserList(data.data);
  //     console.log(data.data);
  //   });
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const company = {
    //   userEmail,
    //   password,
    //   companyLogo,
    // };

    await axios({
      method: "put",
      data: {
        email: userEmail,
        password: password,
        // image: companyLogo,
        // tagline: companyTagline,
        // featured: featured,
        subtitle: companyDetails.subtitle,
        description: companyDetails.description,
        fname: fname,
        jobs: companyDetails.jobs,
        locations: companyDetails.locations,
        tags: companyDetails.tags,
        keyPeople: companyDetails.keyPeople,
        teamSize: companyDetails.teamSize,
        facebook: companyDetails.facebook,
        lname: lname,
        roles: roles,
        numberOfOpenings: companyDetails.numberOfOpenings,
        image: companyDetails.image,
        activecheck: activecheck,
      },
      // withCredentials: true,
      url: `http://localhost:4000/update-company/?_email=${email}`,
    });

    // setuserList((userList) => [...userList, company]);
    // setuserEmail("");
    // setPassword("");
    // setCompanyLogo(null);
    // setModalOpen(false);
  };

  const handleDelete = async (e) => {
    notify();

    await axios({
      method: "delete",
      // withCredentials: true,
      url: `http://localhost:4000/delete-company/${email}`,
    });

    Router.push("/userDashboard/companies");
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setCompanyLogo(readerEvent.target.result);
    };
  };




  return (
    <CardContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Email'
              placeholder=''
              value={userEmail}
              onChange={e => setuserEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='******'
              defaultValue=''
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='First Name'
              placeholder=''
              type='text'
              value={fname}
              onChange={e => setFname(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Last Name'
              placeholder=''
              type='text'
              value={lname}
              onChange={e => setLname(e.target.value)}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label='Status' defaultValue='active'>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label='Role' defaultValue='Admin' value={roles} onChange={e => setRoles(e.target.value)}>
                <MenuItem value='Admin'>Admin</MenuItem>
                <MenuItem value='Author'>Author</MenuItem>
                <MenuItem value='Supervisor'>Supervisor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
            {/* <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button> */}
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
