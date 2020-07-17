const Member = require("../models/Member");
const { age, date } = require("../../lib/utils");

module.exports = {
  index(req, res) {
    const { filter } = req.query;

    if(filter) {
      Member.findBy(filter, (members) => {
        return res.render("members/index", { members, filter });
      });
    } else {
      Member.all((members) => {
        return res.render("members/index", { members });
      });
    };
  },
  create(req, res) {
    Member.instructorsSelectOptions((options) => {
      return res.render("members/create", { instructorOptions: options });
    });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for(key of keys) {
      if(req.body[key] == "")
        return res.send("Por favor preencha todos os campos.");
    }

    Member.create(req.body, (member) => {
      return res.redirect(`/members/${member.id}`);
    });
  },
  show(req, res) {
    Member.find(req.params.id, (member) => {
      if(!member) return res.send("Instrutor não encontrado!");

      member.age = age(member.birth);
      member.birth = date(member.birth).br;
      member.blood = member.blood.replace("1", "+").replace("0", "-");

      return res.render("members/show", { member });
    });
  },
  edit(req, res) {
    Member.find(req.params.id, (member) => {
      if(!member) return res.send("Instrutor não encontrado!");

      member.birth = date(member.birth).iso;
      
      Member.instructorsSelectOptions((options) => {
        return res.render("members/edit", { member, instructorOptions: options });
      });
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for(key of keys) {
      if(req.body[key] == "")
        return res.send("Por favor preencha todos os campos.");
      };

    Member.update(req.body, () => {
      return res.redirect(`members/${req.body.id}`)
    });
  },
  delete(req, res) {
    Member.delete(req.body.id, () => {
      return res.redirect(`members`)
    });
  }
}