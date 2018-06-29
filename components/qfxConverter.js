import React, { Fragment, Component } from "react";
import ReactDOM from "react-dom";
import styled from "react-emotion";
import algoliasearch from "algoliasearch";
import Downshift from "downshift";
import debounce from "lodash.debounce";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CirclularProgress from "@material-ui/core/CircularProgress";
import Dropzone from "react-dropzone";

var client = algoliasearch(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY);
var index = client.initIndex("banks");

const renderSearchField = ({ search, results, classes }) => ({
  getInputProps,
  getItemProps,
  getLabelProps,
  getMenuProps,
  isOpen,
  inputValue,
  highlightedIndex,
  selectedItem
}) => (
  <div className={classes.container}>
    <TextField
      fullWidth
      label="Choose Your Bank"
      className={classes.input}
      inputProps={{
        ...getInputProps({
          onChange: event => {
            const { value } = event.target;
            if (!value) return;
            search(value);
          }
        })
      }}
    />
    <Paper className={classes.paper} {...getMenuProps()}>
      {!isOpen ? null : !results ? (
        <MenuItem>
          <CirclularProgress size={20} /> Loading...
        </MenuItem>
      ) : results ? (
        results.hits.map((item, index) => {
          const isHighlighted = highlightedIndex === index;
          const isSelected = selectedItem === item;
          return (
            <MenuItem
              {...getItemProps({
                key: item.id,
                index,
                item,
                style: {
                  fontWeight: isSelected ? 500 : 400,
                  backgroundColor: isHighlighted ? "#eee" : undefined
                }
              })}
            >
              {item.name}
            </MenuItem>
          );
        })
      ) : null}
    </Paper>
  </div>
);

class PaperPortal extends Component {
  render() {
    return ReactDOM.createPortal(this.props.children, document.body);
  }
}

class QFXConverter extends Component {
  state = {
    saved: false,
    bank: null,
    results: null
  };

  fileRef = React.createRef();
  tempRef = React.createRef();

  handleChange = event => {
    const { files } = event.target;

    this.convertFiles(files);
  };

  convertFiles = files =>
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = this.convertFile(file);
      reader.readAsText(file);
    });

  convertFile = file => event => {
    let text = event.target.result;
    const bank = this.state.bank ? this.state.bank.id : "02153";
    text = text.replace(/<INTU\.BID\>[0-9]{0,5}/, "<INTU.BID>" + bank);

    const url = window.URL.createObjectURL(new Blob([text]));
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.slice(0, -3) + "qbo";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => document.body.removeChild(a));
    this.setState({ saved: true });
    setTimeout(() => this.setState({ saved: false }), 3000);
  };

  search = debounce(async value => {
    this.setState({ loading: true, results: null });
    const results = await index.search({ query: value });
    this.setState({ loading: false, results });
  }, 300);

  handleChangeBank = bank => this.setState({ bank });

  render() {
    const { search } = this;
    const { saved, results } = this.state;
    const { classes } = this.props;

    return (
      <Fragment>
        <Card className={classes.card}>
          <Dropzone
            onDrop={files =>
              this.convertFiles(
                files.filter(file => file.name.endsWith(".qfx"))
              )
            }
            disableClick
            style={{ border: "1px transparent solid", padding: 4 }}
            activeStyle={{
              border: "1px #000 dashed",
              borderRadius: 8
            }}
          >
            <CardHeader title="QFX to QBO Converter" />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                Quickly convert your QFX files to QBO format in the browser.
              </Typography>
              <Typography variant="body1">
                Your files <em>never</em> leave your computer.{" "}
              </Typography>
              <div style={{ width: "100%" }}>
                <Downshift
                  onChange={this.handleChangeBank}
                  itemToString={item => (item ? item.name : "")}
                >
                  {renderSearchField({ search, results, classes })}
                </Downshift>
                <img src="/static/algolia.svg" />
              </div>
            </CardContent>
            <CardActions disableActionSpacing className={classes.actions}>
              {saved ? (
                <Typography variant="title">
                  Your QFX files have been converted.
                </Typography>
              ) : (
                <Fragment>
                  <Button
                    color="primary"
                    variant="raised"
                    onClick={() => this.fileRef.current.click()}
                  >
                    Select one or more QFX files
                  </Button>
                  <input
                    accept=".qfx"
                    type="file"
                    ref={this.fileRef}
                    onChange={this.handleChange}
                    className={classes.hidden}
                    multiple
                  />
                </Fragment>
              )}
            </CardActions>
          </Dropzone>
        </Card>
      </Fragment>
    );
  }
}

const styles = theme => ({
  container: {
    width: "100%",
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  hidden: {
    visibility: "hidden",
    position: "absolute"
  },
  input: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  actions: {
    justifyContent: "center",
    padding: theme.spacing.unit * 2
  },
  card: { overflow: "inherit", width: 600, marginBottom: theme.spacing.unit }
});

export default withStyles(styles)(QFXConverter);
