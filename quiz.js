// JavaScript file for hw-3 "Квиз - Географија"
var score = 0;      //Promjenjiva za poene
var questionN = 0;  //Promjenjiva za redni broj pitanja 
var obj = [];       //Niz u kome će biti 10 random pitanja iz .json fajla
var clickedButton = false;  //Pomoćna promjenjiva za setovanje tajmera

$(document).ready(function(){
  $("#leave_score_time").css("display", "none");
});

function onLoad(){
  document.getElementById("name").value = "";
}

//UČITAVANJE IZ .json FAJLA:      
fetch("./questions.json").then(function (resp){  //ucitavanje iz .json fajla
  return resp.json();
})
.then(function(questions){
  //Nasumično uzimanje 10 pitanja iz promjenjive u koju je učitan "JSON" i
  //dodavanje tih pitanja u "obj" niz iz koga će biti učitana u kviz 
  var randomIndexArr = [];
  var randomStringArr = [];
  for (ui = 0; ui < 10; ui++){
    var ri = Math.floor(Math.random() * questions.length);
    if (randomIndexArr.includes(ri)){
      ui--;
    }
    else{
      randomIndexArr.push(ri);
      randomStringArr.push(JSON.stringify(questions[ri]));
    }
  }
  for (qi = 0 ; qi < randomStringArr.length; qi++){
      obj.push(JSON.parse(randomStringArr[qi]));
  }
})

$(document).ready(function(){
  $("#next").click(function(){
      var name = $("#name").val().toString();
      if (name != ""){
        $(".was-validated").hide();
        $("#globe_smiley").hide();
        $("#next").hide();
        document.getElementById("welcome").innerHTML = $("#name").val()+", добродошли у квиз који ће тестирати Ваше знање из географије. Упознајте се са правилима и започните квиз.<br><b>Срећно!</b>"
        $("#welcome").fadeIn();
        $("#start").fadeIn();
        $("#resultTable").fadeIn();
        $(".rules").fadeIn();
        loadResultInTableBeginning();
      }
  });
});

$(document).ready(function(){
  $("#start").click(function(){
    $("#welcome").hide();
    $("#start").hide();
    $("#header").hide();
    $("#resultTable").hide();
    $("#leave_score_time").fadeIn();
    loadNextAfterInterval(0, 0);
  });
});

function onSkipButton(id){
  var nmb = Number(id);
  if (nmb < 10){
    clickedButton = true;
    loadNextAfterInterval(nmb, 0);
  }
  else{
    clickedButton = true;
    loadEnd();
  }
}

function loadEnd(){
  $(".questions").hide();
  $("#leave_score_time").hide();
  $(".endConfiguration").fadeIn();
  document.getElementById("score_num").innerHTML = score.toString()+"/10";
  loadResultInTableEnd();
}

function loadEndAfterInterval(per){
  var sec = per;
  var timerForEnd = setInterval(toEnd, 1500);
  function toEnd() {
    sec--;
    if (sec == 0) {
      clearInterval(timerForEnd);
      loadEnd();
    }
  }
}

$(document).ready(function(){
  $("#leaveButton").click(function(){
    clickedButton = true;
    loadEnd();
  });
});

$(document).ready(function(){
  $("#again").click(function(){
    location.reload();
    return false;
  });
});

function loadNext(quest_num_before, quest_num_temp, n_num){

  var idNum, idQuestion, pattTrue, pattFalse;

  $(quest_num_before).hide();
  $(quest_num_temp).fadeIn();
    
  idNum = "num"+n_num.toString();
  idQuestion = "question"+n_num.toString();
  idAnswerButton = "answerButton"+n_num.toString();
  idAnswerInput = "answerInput"+n_num.toString();
  questionN += 1;
  document.getElementById(idNum).innerHTML = questionN.toString()+". питање";
  document.getElementById(idQuestion).innerHTML = obj[n_num-1].question + "<br>";

  var idSubmit = "submit"+n_num.toString();
  if (obj[n_num-1].type == "offered"){
    $("#answerInput"+n_num.toString()).hide();
    var idButtonNum = 0;
    $("#"+idSubmit).hide();
    var idButton;
    for (j in obj[n_num-1].answers){
      idButtonNum += 1;
      pattTrue = /true[0-9]/;
      pattFalse = /false[0-9]/;
      idButton = "button_answer_q" + questionN.toString() + idButtonNum.toString();
      document.getElementById(idButton).innerHTML += "<b>"+obj[n_num-1].answers[j]+"</b>";
      document.getElementById("button_answer_q"+questionN.toString()+"1").onclick = function() {onClickOfferedButton("button_answer_q"+questionN.toString()+"1", questionN)}
      document.getElementById("button_answer_q"+questionN.toString()+"2").onclick = function() {onClickOfferedButton("button_answer_q"+questionN.toString()+"2", questionN)}
      document.getElementById("button_answer_q"+questionN.toString()+"3").onclick = function() {onClickOfferedButton("button_answer_q"+questionN.toString()+"3", questionN)}
      document.getElementById("button_answer_q"+questionN.toString()+"4").onclick = function() {onClickOfferedButton("button_answer_q"+questionN.toString()+"4", questionN)}
      if (j.toString().match(pattTrue) != null){
        document.getElementById(idButton).value = j.toString().match(pattTrue);
      }
      else if (j.toString().match(pattFalse) != null){
        document.getElementById(idButton).value = j.toString().match(pattFalse);
      }
    }
  }
  else if (obj[n_num-1].type == "input"){
    $("#answerButton"+n_num.toString()).hide();
    idInput = "input"+n_num; 
    document.getElementById(idInput).value = "";
    $(document).ready(function(){
      $("#submit"+n_num.toString()).click(function(){
        $("#submit"+n_num.toString()).hide();
        $("#skip"+n_num.toString()).hide();
        var numTrue = 0;
        for (j in obj[n_num-1].answers){
          if(document.getElementById(idInput).value.toString() == obj[n_num-1].answers[j.toString()]){
            numTrue += 1;
          }
        }
        if (numTrue > 0){
          $("#correct"+n_num.toString()).fadeIn();
          score +=1 ;
          document.getElementById("score").innerHTML = "ПОЕНИ: "+score.toString();
        }
        else{
          document.getElementById("incorrect"+n_num.toString()).innerHTML += "<br>"+"<p style=\"color: green;\">"+"(Тачан одговор: " + obj[n_num-1].answers.true1 + ")</p>"
          $("#incorrect"+n_num.toString()).fadeIn();
        }
        clickedButton = true;
        if (n_num < 10){
          loadNextAfterInterval(n_num, 1);
        }
        else{
          clickedButton = true;
          loadEndAfterInterval(1);
        }
      });
    });
  }
}

function disableButtons(questNumber){
  var tmpForDisable;
  for (tmpForDisable = 1; tmpForDisable < 5; tmpForDisable++){
    document.getElementById("button_answer_q"+questNumber.toString()+tmpForDisable.toString()).disabled = true;
  }
};

function onClickOfferedButton(id, qn){
  document.getElementById("skip"+qn.toString()).style.display = "none";
  if (document.getElementById(id).value == "true1"){
    document.getElementById(id).style.backgroundColor = "green";
    disableButtons(qn);
    if (qn < 10){
      clickedButton = true;
      loadNextAfterInterval(qn, 1);
    }
    else {
      clickedButton = true;
      loadEndAfterInterval(1);
    }
    $("#correct"+qn.toString()).fadeIn();
    score += 1;
    document.getElementById("score").innerHTML = "ПОЕНИ: "+score.toString();
  }
  else {
    document.getElementById(id).style.backgroundColor = "red";
    var d;
    disableButtons(qn);
    if (qn < 10){
      clickedButton = true;
      loadNextAfterInterval(qn, 1);
    }
    else {
      clickedButton = true;
      loadEndAfterInterval(1);
    }
    $("#incorrect"+qn.toString()).fadeIn();
    for (d = 1; d < 5; d++) {
      if (document.getElementById("button_answer_q"+qn.toString()+d.toString()).value == "true1"){
        document.getElementById("button_answer_q"+qn.toString()+d.toString()).style.backgroundColor = "green";
      }
    }
  }
}; 

function loadNextAfterInterval(current, period){
  var nextNum = current + 1;
  if(period == 0){
    loadNextNowAndAfterTwentySec("#quest"+current.toString(), "#quest"+nextNum.toString(), nextNum);
  }
  else if (period == 1){
    var seconds = period;
    var interval = setInterval(afterPeriod, 1500);
    function afterPeriod() {
      seconds--;
      if (seconds == 0) {
        clearInterval(interval);
        loadNextNowAndAfterTwentySec("#quest"+current.toString(), "#quest"+nextNum.toString(), nextNum);
      }
    }
  }
}

function loadNextNowAndAfterTwentySec (quest_num_current, quest_num_next, n_next) {
  if (n_next <= 10){
    loadNext(quest_num_current, quest_num_next, n_next);
    var nextAfterNext = n_next + 1;
    var scnd = 19;
    var timerForNext = setInterval(afterInterval, 1000);
    document.getElementById("time").innerHTML = "ТАЈМЕР: 20";
    function afterInterval() {
      document.getElementById("time").innerHTML = "ТАЈМЕР: " + scnd;
      if(clickedButton == true){
        document.getElementById("time").innerHTML = "ТАЈМЕР: 20";
        clearInterval(timerForNext);
        clickedButton = false;
        scnd = 19;
      }
      scnd--;
      if (scnd == -2) {
        clearInterval(timerForNext);
        loadNextNowAndAfterTwentySec (quest_num_next, "#quest"+nextAfterNext.toString(), nextAfterNext)
      }
    }
  }
  else {
    loadEnd();
  }
}

//FUNKCIJE ZA UČITAVANJE REZULTATA U PERMANENTNU TABELU:
function loadResultInTableBeginning(){
  var arrayOfResults = localStorage.getItem("arrayOfResults");
  arrayOfResults = (arrayOfResults) ? JSON.parse(arrayOfResults) : [];
  localStorage.setItem("arrayOfResults", JSON.stringify(arrayOfResults));
  writeResInModalBody(arrayOfResults);
}
function loadResultInTableEnd(){
  var arrayOfResults = localStorage.getItem("arrayOfResults");
  arrayOfResults = (arrayOfResults) ? JSON.parse(arrayOfResults) : [];
  loadResult(arrayOfResults, score);
  localStorage.setItem("arrayOfResults", JSON.stringify(arrayOfResults));
  writeResInModalBody(arrayOfResults);
}
function loadResult(topRes, scr){
  var name = document.getElementById("name").value;
  scr = score;
  topRes[topRes.length] = name+"  "+scr.toString();
}
function writeResInModalBody(arrayRes){
  //Sortiranje po broju poena
  for (j=0; j<arrayRes.length; j++){
    for (k=j+1; k<arrayRes.length; k++){
      if(Number(arrayRes[j].slice(-2)) < Number(arrayRes[k].slice(-2))){
        var temp = arrayRes[k];
        arrayRes[k] = arrayRes[j];
        arrayRes[j] = temp;
      }
    }
  }
  //Sortiranje po abecednom redu (ukoliko više takmičara ima isti broj poena)
  for (a=0; a<arrayRes.length; a++){
    var canGoNext = true;
    var g = a+1;
    for (b=a+1; b<arrayRes.length; b++){
      if(Number(arrayRes[a].slice(-2)) == Number(arrayRes[b].slice(-2))){
        if(canGoNext){
          g+=1;
        }
      }
      else{
        canGoNext = false;
      }
    }
    for(c=a+1; c<g; c++){
      if (arrayRes[a].substring(0, arrayRes[a].length-2).toUpperCase() > arrayRes[c].substring(0, arrayRes[c].length-2).toUpperCase()){
        var tmp = arrayRes[c];
        arrayRes[c] = arrayRes[a];
        arrayRes[a] = tmp;
      }
    }
  }
  //Pravljenje tabele sa rezultatima
  var tableString = "";
  for (i=0; i<arrayRes.length; i++){
    if(i<10){
      tableString += "<tr>"+"<td>"+arrayRes[i].substring(0,arrayRes[i].length-2).toString()+"</td>"+"<td>"+arrayRes[i].slice(-2).toString()+"</td>"+"</tr>"
    }  
  } 
  document.getElementById("tableResModalBody").innerHTML = "<tr><th>Име учесника</th><th>Број поена</th>"+ tableString;
}
