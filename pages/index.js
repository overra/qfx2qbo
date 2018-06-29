import React from "react";
import QFXConverter from "../components/qfxConverter";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Disqus from "disqus-react";

const Index = ({ classes }) => (
  <div className={classes.container}>
    <QFXConverter />
    <ExpansionPanel defaultExpanded className={classes.panel}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>Attributions</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography component="ul" className={classes.list}>
          <li>
            Conversion method provided by{" "}
            <a href="https://collaboration133.com/converting-qfx-files-to-qbo-files-for-import-to-quickbooks-via-web-connect/887/">
              Collboration133
            </a>
          </li>
          <li>
            Hosting provided by <a href="https://now.sh">Now</a>
          </li>
          <li>
            6,232 banks indexed by{" "}
            <a href="https://algolia.com" target="_blank">
              Algolia
            </a>
          </li>
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
    <ExpansionPanel defaultExpanded className={classes.panel}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>Comments</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.comments}>
        <Disqus.DiscussionEmbed
          shortname="https-convert-qfx-now-sh"
          config={{
            identifier: "convert-qfx-to-qbo",
            title: "QFX to QBO Conversion",
            url: "https://convert-qfx.now.sh"
          }}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
);

const styles = theme => ({
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  panel: {
    width: 600
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  list: {
    "& li:before": {
      content: `"❤️"`
    },
    listStyleType: "none",
    padding: 0
  },
  comments: { "& #disqus_thread": { width: 600 } }
});

export default withStyles(styles)(Index);
