import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import React from "react";
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import ArgonBox from "components/ArgonBox";
import { Grid } from "@mui/material";

const Technology = () => {
  return (
    <ArgonBox p={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} xl={3}>
          <DefaultProjectCard
            image={homeDecor1}
            label="Tech #2"
            title="modern"
            description="As Uber works through a huge amount of internal management turmoil."
          />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <DefaultProjectCard
            image={homeDecor2}
            label="Tech #1"
            title="scandinavian"
            description="Music is something that every person has his or her own specific opinion about."
            authors={[]}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <DefaultProjectCard
            image={homeDecor3}
            label="Tech #3"
            title="minimalist"
            description="Different people have different taste, and various types of music."
            authors={[]}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <DefaultProjectCard
            image={homeDecor1}
            label="Tech #2"
            title="modern"
            description="As Uber works through a huge amount of internal management turmoil."
            authors={[]}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <DefaultProjectCard
            image={homeDecor1}
            label="Tech #2"
            title="modern"
            description="As Uber works through a huge amount of internal management turmoil."
            authors={[]}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <DefaultProjectCard
            image={homeDecor2}
            label="Tech #1"
            title="scandinavian"
            description="Music is something that every person has his or her own specific opinion about."
            authors={[]}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={3}>
          <DefaultProjectCard
            image={homeDecor3}
            label="Tech #3"
            title="minimalist"
            description="Different people have different taste, and various types of music."
            authors={[]}
          />
        </Grid>
      </Grid>
    </ArgonBox>
  );
};

export default Technology;
