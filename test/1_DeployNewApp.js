var MemberRoles = artifacts.require("MemberRoles");
var GovBlocksMaster = artifacts.require("GovBlocksMaster");
var Master = artifacts.require("Master");
var GBTStandardToken = artifacts.require("GBTStandardToken");
var Governance = artifacts.require("Governance");
var GovernanceData = artifacts.require("GovernanceData");
var Pool = artifacts.require("Pool");
var ProposalCategory = artifacts.require("ProposalCategory");
var SimpleVoting = artifacts.require("SimpleVoting");
var EventCaller = artifacts.require("EventCaller");
var ProposalCategoryAdder = artifacts.require("ProposalCategoryAdder");
var gbts;
var gbm;
var ec;
var gd;
var mr;
var pc;
var sv;
var gv;
var pl;
var add = [];
var ms;
var pca;
const json = require('./../build/contracts/Master.json');
var bytecode = json['bytecode'];

describe('Deploy new dApp', function() {
  it("should create a new dApp", async function () {
    this.timeout(100000);
    gbm = await GovBlocksMaster.new();
    gbts =  await GBTStandardToken.new();
    ec = await EventCaller.new();
    await gbm.govBlocksMasterInit(gbts.address, ec.address);
    await gbm.setMasterByteCode(bytecode);
    await gbm.addGovBlocksUser("0x42", gbts.address, "descHash");
    gd = await GovernanceData.new();
    mr = await MemberRoles.new();
    pc = await ProposalCategory.new();
    sv = await SimpleVoting.new();
    gv = await Governance.new();
    pl = await Pool.new();
    let owner = await gbm.owner();
    await mr.memberRolesInitiate("0x42", gbts.address, owner)
    await pc.proposalCategoryInitiate("0x42");
    add.push(gd.address);
    add.push(mr.address);
    add.push(pc.address);
    add.push(sv.address);
    add.push(gv.address);
    add.push(pl.address);
    let mad = await gbm.getDappMasterAddress("0x42");
    ms = await Master.at(mad);
    await ms.addNewVersion(add);
    let cv = await ms.getCurrentVersion();
    assert.equal(cv.toNumber(), 1, "dApp version not created");
  });
});
