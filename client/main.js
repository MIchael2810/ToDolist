import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Accounts} from 'meteor/accounts-base';

import './main.html';
import '../lib/collections.js'
 
Template.task.helpers({
	AllTasks(){
		return taskDB.find({},{sort:{Owner:-1,Checked: -1}});
	},

	isPrivate(){
		if(taskDB.findOne({'_id':this._id}).Status=="Private"){
			if(Meteor.user()){
				if(Meteor.user()._id==taskDB.findOne({'_id':this._id}).Owner){
					return true;
				}
			}
		}
		return false;
	},
	isPublic(){
		if(taskDB.findOne({'_id':this._id}).Status=="Public"){
			return true;
		}
		return false;
	}
})

Template.task.events({
	'click .js-checked'(event){
		var idval = "Checkbox" + this._id
		var chkbox = document.getElementById(idval);
		var val = chkbox.checked
		taskDB.update({'_id':this._id},{$set:{'Checked':val}});
	},

	'click .js-delete'(event){
		var idval = this._id
		$("#" +idval).fadeOut("slow","swing",function(){
            taskDB.remove({_id:idval});
        });
	}
})

Template.addtaskModal.events({
	'click .js-save'(event){
		var name = $("#TaskName").val();
		var status =$("#TaskStatus").val();
		$("#TaskName").val('');
		var ownerval = "";
		if(status == "Private"){
			ownerval = Meteor.user()._id;
		}
  		taskDB.insert({'Name':name, 'Status':status, 'Checked':false, 'Owner':ownerval});
  		$("#addTask").modal('hide');
  	}	
});