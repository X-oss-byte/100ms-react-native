package com.qa.tests.MeetingRoomTest.MenuDropDownTest;

import com.qa.pages.HomePage;
import com.qa.pages.MeetingRoomPage.BottomToolBar.LeaveRoom;
import com.qa.pages.PageFlowFunc;
import org.testng.Assert;
import org.testng.annotations.Test;

public class EndRoomTest {

    @Test
    public void Test_EndRoom() throws InterruptedException {
        System.out.println("Verify End Room for all");
        Thread.sleep(2000);
        PageFlowFunc pageFlow = new PageFlowFunc();
//        EndRoom endRoom = new EndRoom();
        LeaveRoom leaveRoom = new LeaveRoom();
        HomePage homePage = new HomePage();

        pageFlow.goto_meetingRoom_menuDropDown();
//        Assert.assertTrue(endRoom.endRoomBtn.isDisplayed());
//        endRoom.click_endRoomBtn();

//        String meeting_ended_flag = leaveRoom.meetingEndedNotification.getAttribute("content-desc");
        String meeting_ended_text = "Meeting Ended";
//        Assert.assertEquals(meeting_ended_flag, meeting_ended_text);

        Assert.assertTrue(homePage.joinMeetingBtn.isDisplayed());
    }

}