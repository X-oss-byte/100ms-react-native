package com.qa.tests;

import com.qa.BaseTest;
import com.qa.pages.HomePage;
import com.qa.pages.PageFlowFunc;
import com.qa.pages.PreviewPage;
import com.qa.utils.TestUtils;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.testng.Assert;
import org.testng.annotations.*;
import org.testng.asserts.SoftAssert;

import java.io.InputStream;
import java.lang.reflect.Method;

public class PreviewPageTest extends BaseTest {

    HomePage homePage;
    PreviewPage previewPage;
    JSONObject meetingDetail;
    TestUtils utils = new TestUtils();
    SoftAssert sa;

    @BeforeClass
    public void beforeClass() throws Exception {
      InputStream datais = null;
      try {
        String dataFileName = "data/meetingDetail.json";
        datais = getClass().getClassLoader().getResourceAsStream(dataFileName);
        JSONTokener tokener = new JSONTokener(datais);
        meetingDetail = new JSONObject(tokener);
      } catch(Exception e) {
        e.printStackTrace();
        throw e;
      } finally {
        if(datais != null) {
          datais.close();
        }
      }
    }

    @AfterClass
    public void afterClass() {
    }

    @BeforeMethod
    public void beforeMethod(Method m) throws InterruptedException {
      closeApp();
      launchApp();
      utils.log().info("\n" + "****** starting test:" + m.getName() + "******" + "\n");
      sa = new SoftAssert();
      homePage = new HomePage();
      previewPage = homePage.goto_previewPage(meetingDetail.getJSONObject("valid").
        getString("meeting_url"), meetingDetail.getJSONObject("valid").getString("username"));
    }

    @AfterMethod
    public void afterMethod() {
      sa.assertAll();
    }

    @Test
    public void Test_PreviewPage() throws InterruptedException {
        System.out.println("Verify Preview page locators");
        Thread.sleep(2000);

        sa.assertTrue(previewPage.videoTile.isDisplayed());
        sa.assertTrue(previewPage.camBtn.isDisplayed());
        sa.assertTrue(previewPage.micBtn.isDisplayed());
        sa.assertTrue(previewPage.joinNowBtn.isDisplayed());

        click(previewPage.camBtn);
        click(previewPage.micBtn);
        click(previewPage.joinNowBtn);

    }

}